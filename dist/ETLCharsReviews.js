"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
            value: Number(row.value)
        };
        tempStorage.push(obj);
    });
    parsedStream.on('end', () => {
        CharReviews_1.CharReviews.insertMany(tempStorage);
        console.log('first data: ', tempStorage[0]);
        console.log('finished parsing csv file');
    });
};
mongoose_1.default.set('strictQuery', false);
mongoose_1.default.connect(app_1.url, { dbName: app_2.dbName, })
    .then(() => {
    console.log('connected to db');
    parseCharReviews();
})
    .catch((err) => {
    console.log('error connecting to db: ', err);
});
//# sourceMappingURL=ETLCharsReviews.js.map