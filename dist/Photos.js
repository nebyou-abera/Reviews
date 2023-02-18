"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Photos = exports.PhotosSchema = void 0;
const mongoose_1 = require("mongoose");
const photosCollectionName = 'photos';
exports.PhotosSchema = new mongoose_1.Schema({
    id: Number,
    'review_id': Number,
    url: String
});
exports.Photos = (0, mongoose_1.model)(photosCollectionName, exports.PhotosSchema);
//# sourceMappingURL=Photos.js.map