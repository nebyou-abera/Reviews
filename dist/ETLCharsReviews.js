"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCharReviews = void 0;
const fs_1 = __importDefault(require("fs"));
const papaparse_1 = __importDefault(require("papaparse"));
const CharReviews_1 = require("./CharReviews");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const app_2 = require("./app");
const charReviewsPath = '../csv/characteristic_reviews.csv';
const parseCharReviews = () => {
    const tempStorage = [];
    const stream = fs_1.default.createReadStream(charReviewsPath);
    const header = { header: true };
    const parsedStream = papaparse_1.default.parse(papaparse_1.default.NODE_STREAM_INPUT, header);
    stream.pipe(parsedStream);
    parsedStream.on('data', (row) => {
        // console.log(row);
        const obj = {
            id: Number(row.id),
            'characteristic_id': Number(row.characteristic_id),
            'review_id': Number(row.review_id),
            value: String(row.value)
        };
        tempStorage.push(obj);
    });
    parsedStream.on('end', () => {
        CharReviews_1.CharReviews.insertMany(tempStorage);
        console.log('first data: ', tempStorage[0]);
        console.log('finished parsing csv file');
    });
};
const seedCharReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default.connect(app_1.url, { dbName: app_2.dbName })
        .then(() => {
        console.log('connected to db');
        parseCharReviews();
    })
        .catch((err) => {
        console.log(err);
    });
});
exports.seedCharReviews = seedCharReviews;
//# sourceMappingURL=ETLCharsReviews.js.map