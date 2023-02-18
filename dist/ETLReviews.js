"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const papaparse_1 = __importDefault(require("papaparse"));
const Reviews_1 = require("./Reviews");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const app_2 = require("./app");
const reviewsPath = '../csv/reviews.csv';
// make a function that convers strings of true or false to boolean
const parseBoolean = (str) => {
    if (str === 'true' || str === 'TRUE' || str === 'True') {
        return true;
    }
    else {
        return false;
    }
};
const parseReviews = () => {
    const tempStorage = [];
    const stream = fs_1.default.createReadStream(reviewsPath);
    const header = { header: true };
    const parsedStream = papaparse_1.default.parse(papaparse_1.default.NODE_STREAM_INPUT, header);
    stream.pipe(parsedStream);
    parsedStream.on('data', (row) => {
        const date = new Date(Number(row.date));
        const dateString = date.toISOString();
        const obj = {
            id: Number(row.id),
            'product_id': Number(row.product_id),
            rating: Number(row.rating),
            date: dateString,
            summary: String(row.summary),
            body: String(row.body),
            recommend: parseBoolean(row.recommend),
            reported: parseBoolean(row.reported),
            'reviewer_name': String(row.reviewer_name),
            'reviewer_email': String(row.reviewer_email),
            response: String(row.response),
            helpfulness: Number(row.helpfulness)
        };
        tempStorage.push(obj);
    });
    parsedStream.on('end', () => {
        Reviews_1.Reviews.insertMany(tempStorage);
        console.log('first data: ', tempStorage[0]);
        console.log('finished parsing csv file');
    });
};
mongoose_1.default.set('strictQuery', false);
mongoose_1.default.connect(app_1.url, { dbName: app_2.dbName, })
    .then(() => {
    console.log('connected to db');
    parseReviews();
})
    .catch((err) => {
    console.log('error connecting to db: ', err);
});
//# sourceMappingURL=ETLReviews.js.map