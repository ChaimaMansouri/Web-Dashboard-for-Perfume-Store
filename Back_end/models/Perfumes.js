const mongoose = require("mongoose");

const perfumeSchema = new mongoose.Schema({
    brand: String,
    title: String,
    type: String,
    price: Number,
    priceWithCurrency: String,
    available: Number,
    availableText: String,
    sold: Number,
    lastUpdated: Date,
    itemLocation: String,
    gender: String
});

module.exports = mongoose.model("Perfume", perfumeSchema);
