"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reviews = exports.ReviewsSchema = void 0;
const mongoose_1 = require("mongoose");
const Photos_1 = require("./Photos");
const reviewsCollectionName = 'reviews';
exports.ReviewsSchema = new mongoose_1.Schema({
    id: { type: Number, required: false },
    'product_id': Number,
    rating: Number,
    date: Number,
    summary: String,
    body: String,
    recommend: Boolean,
    reported: Boolean,
    'reviewer_name': String,
    'reviewer_email': String,
    response: String,
    helpfulness: Number,
    photos: { type: [Photos_1.PhotosSchema], required: false }
});
exports.Reviews = (0, mongoose_1.model)(reviewsCollectionName, exports.ReviewsSchema);
//# sourceMappingURL=Reviews.js.map