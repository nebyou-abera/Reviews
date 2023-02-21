"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharReviews = exports.CharReviewsSchema = void 0;
const mongoose_1 = require("mongoose");
const charReviewsCollectionName = 'charReviews';
exports.CharReviewsSchema = new mongoose_1.Schema({
    id: Number,
    'characteristic_id': Number,
    'review_id': Number,
    value: String
});
exports.CharReviews = (0, mongoose_1.model)(charReviewsCollectionName, exports.CharReviewsSchema);
//# sourceMappingURL=CharReviews.js.map