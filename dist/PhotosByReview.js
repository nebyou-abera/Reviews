"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Photos = exports.PhotosByReviewSchema = void 0;
const mongoose_1 = require("mongoose");
const photosCollectionName = 'photosByReview';
exports.PhotosByReviewSchema = new mongoose_1.Schema({
    'id': Number,
    url: String
});
exports.Photos = (0, mongoose_1.model)(photosCollectionName, exports.PhotosByReviewSchema);
//# sourceMappingURL=PhotosByReview.js.map