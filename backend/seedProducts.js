require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");
const connectDb = require("./config/db");

const seed = async () => {
  try {
    await connectDb();
    await Product.deleteMany({});
    console.log("Old products are removed");
    const baseProducts = [
      {
        name: "Classic White T-Shirt",
        description: "Soft cotton crew neck t-shirt.",
        price: 19.99,
        image: "https://picsum.photos/seed/tshirt1/400/400",
        category: "Men",
        sizes: ["S", "M", "L", "XL"],
        stock: 50,
      },
      {
        name: "Blue Denim Jeans",
        description: "Slim fit mid-rise jeans.",
        price: 49.99,
        image: "https://picsum.photos/seed/jeans1/400/400",
        category: "Men",
        sizes: ["S", "M", "L", "XL"],
        stock: 40,
      },
      {
        name: "Black Hoodie",
        description: "Fleece-lined pullover hoodie.",
        price: 39.99,
        image: "https://picsum.photos/seed/hoodie1/400/400",
        category: "Men",
        sizes: ["M", "L", "XL"],
        stock: 35,
      },
      {
        name: "Red Summer Dress",
        description: "Lightweight floral summer dress.",
        price: 59.99,
        image: "https://picsum.photos/seed/dress1/400/400",
        category: "Women",
        sizes: ["S", "M", "L"],
        stock: 30,
      },
      {
        name: "Women's Black Leggings",
        description: "High-waist stretch leggings.",
        price: 24.99,
        image: "https://picsum.photos/seed/leggings1/400/400",
        category: "Women",
        sizes: ["S", "M", "L", "XL"],
        stock: 60,
      },
      {
        name: "Girls Pink Hoodie",
        description: "Kids fleece hoodie.",
        price: 29.99,
        image: "https://picsum.photos/seed/kidshoodie1/400/400",
        category: "Kids",
        sizes: ["S", "M", "L"],
        stock: 25,
      },
      {
        name: "Boys Graphic T-Shirt",
        description: "Cotton t-shirt with fun print.",
        price: 17.99,
        image: "https://picsum.photos/seed/kidstee1/400/400",
        category: "Kids",
        sizes: ["S", "M", "L"],
        stock: 45,
      },
    ];

    const productData = [];
    let counter = 1;

    while (productData.length < 20) {
      baseProducts.forEach((p) => {
        if (productData.length < 20) {
          productData.push({
            ...p,
            name: `${p.name} #${counter}`,
            price: Number(p.price + (counter % 5)).toFixed(2),
            stock: p.stock - (counter % 10),
          });
          counter++;
        }
      });
    }

    await Product.insertMany(productData);
    console.log("Inserted 20 products into MongoDB Atlas");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();
