const mongoose = require("mongoose");

// strict:false → allows any structure (perfect for sample_mflix)
const movieSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model("Movie", movieSchema, "movies");
//          modelName    schema     collectionName
