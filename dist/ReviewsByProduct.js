"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reviews = exports.ReviewsByProductSchema = void 0;
const mongoose_1 = require("mongoose");
const PhotosByReview_1 = require("./PhotosByReview");
const reviewsCollectionName = 'reviewsByProduct';
exports.ReviewsByProductSchema = new mongoose_1.Schema({
    'review_id': Number,
    rating: Number,
    summary: String,
    recommend: Boolean,
    response: String,
    body: String,
    date: String,
    'reviewer_name': String,
    helpfulness: Number,
    photos: { type: [PhotosByReview_1.PhotosByReviewSchema], required: false }
});
exports.Reviews = (0, mongoose_1.model)(reviewsCollectionName, exports.ReviewsByProductSchema);
//# sourceMappingURL=ReviewsByProduct.js.map