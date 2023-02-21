"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products = exports.ProductsSchema = void 0;
const mongoose_1 = require("mongoose");
const Reviews_1 = require("./Reviews");
const productsCollectionName = 'products';
exports.ProductsSchema = new mongoose_1.Schema({
    'product_id': Number,
    name: String,
    slogan: String,
    description: String,
    category: String,
    'default_price': Number,
    // page: Number,
    // count: Number,
    results: { type: [Reviews_1.ReviewsSchema], required: false }
});
exports.Products = (0, mongoose_1.model)(productsCollectionName, exports.ProductsSchema);
//# sourceMappingURL=Products.js.map