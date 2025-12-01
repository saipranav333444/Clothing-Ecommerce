require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const User = require("./models/User");
const Product = require("./models/Product");
const Cart = require("./models/Cart");
const connectDb = require("./config/db");
const auth = require("./authMiddleware");
connectDb();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Registration of User
app.post("/register/", async (request, response) => {
  try {
    const { username, password, email } = request.body;
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return response.status(400).json({
        message: "User already exists with this email or username",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    console.log("Registered Successful");
    response.status(201).json({ message: "Registration successful" });
  } catch (error) {
    response.status(500).json({ message: "Server error during registration" });
  }
});

app.post("/login/", async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email });
    if (!user) {
      return response
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    // Optional: still set cookie if you want
    // response.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

    console.log("Login Successful");

    return response.json({
      message: "Login Successful",
      token: token, // send token in JSON response
    });
  } catch (error) {
    return response.status(500).json({
      message: "Server error during login",
    });
  }
});

app.get("/api/products", auth, async (request, response) => {
  try {
    const {
      category,
      sizes,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      search,
    } = request.query;

    const query = {};

    const allowedSizes = ["S", "M", "L", "XL"];

    if (category) {
      const categories = category.split(",").map((c) => c.trim());
      query.category = { $in: categories };
    }

    if (sizes) {
      const sizeArray = sizes.split(",").map((c) => c.trim());

      const isValid = sizeArray.every((s) => allowedSizes.includes(s));

      if (!isValid) {
        return response.json({
          products: [],
          message: "Invalid size filter",
        });
      }

      query.sizes = { $in: sizeArray };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        {
          description: { $regex: search, $options: "i" },
        },
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query).skip(skip).limit(limitNum);
    console.log(products);
    response.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    response.status(500).json({ message: "Server error fetching products" });
  }
});

// Add item to cart
app.post("/api/cart/add", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, size, qty } = req.body;

    if (!productId || !size || !qty) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (qty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const index = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size.toLowerCase() === size.toLowerCase()
    );

    if (index > -1) {
      cart.items[index].qty += qty;
    } else {
      cart.items.push({ product: productId, size, qty });
    }

    await cart.save();
    return res.json(cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error adding product to cart" });
  }
});

// Update item quantity in cart
app.put("/api/cart/update", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, size, qty } = req.body;

    if (!productId || !size || qty === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (qty < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size.toLowerCase() === size.toLowerCase()
    );

    if (index === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    if (qty === 0) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].qty = qty;
    }

    await cart.save();
    return res.json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error updating cart" });
  }
});

// Remove item from cart
app.delete("/api/cart/remove", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, size } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          item.size.toLowerCase() === size.toLowerCase()
        )
    );

    await cart.save();
    return res.json(cart);
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Server error removing item from cart" });
  }
});

// Get user cart
app.get("/api/cart", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error fetching cart" });
  }
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
