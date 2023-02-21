"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Photos = exports.ProductsSchema = void 0;
const mongoose_1 = require("mongoose");
const ReviewsByProduct_1 = require("./ReviewsByProduct");
const productsCollectionName = 'products';
exports.ProductsSchema = new mongoose_1.Schema({
    'product_id': String,
    results: [ReviewsByProduct_1.ReviewsByProductSchema]
});
exports.Photos = (0, mongoose_1.model)(productsCollectionName, exports.ProductsSchema);
//# sourceMappingURL=ProductsQuery.js.map