"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Characteristics = exports.CharacteristicsSchema = void 0;
const mongoose_1 = require("mongoose");
const characteristicsCollectionName = 'characteristics';
exports.CharacteristicsSchema = new mongoose_1.Schema({
    id: Number,
    'product_id': Number,
    name: String
});
exports.Characteristics = (0, mongoose_1.model)(characteristicsCollectionName, exports.CharacteristicsSchema);
//# sourceMappingURL=Characteristics.js.map