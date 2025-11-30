const jwt = require("jsonwebtoken");

const auth = (request, response, next) => {
  const token = request.cookies.token;
  if (!token) return response.status(401).send("Not authorized");

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  request.user = decoded;
  next();
};

module.exports = auth;
