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
exports.seedReviews = exports.addOneReviewToReviews = exports.parseReviews = exports.parseBoolean = exports.reviewsPath = void 0;
const fs_1 = __importDefault(require("fs"));
const papaparse_1 = __importDefault(require("papaparse"));
const Reviews_1 = require("./Reviews");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const app_2 = require("./app");
exports.reviewsPath = '../csv/reviews.csv';
// make a function that convers strings of true or false to boolean
const parseBoolean = (str) => {
    if (str === 'true' || str === 'TRUE' || str === 'True') {
        return true;
    }
    else {
        return false;
    }
};
exports.parseBoolean = parseBoolean;
const parseReviews = (path = exports.reviewsPath) => {
    const tempStorage = [];
    const stream = fs_1.default.createReadStream(path);
    const header = { header: true };
    const parsedStream = papaparse_1.default.parse(papaparse_1.default.NODE_STREAM_INPUT, header);
    stream.pipe(parsedStream);
    parsedStream.on('data', (row) => {
        // const date = new Date(Number(row.date));
        // const dateString = date.toISOString();
        const obj = {
            id: Number(row.id),
            'product_id': Number(row.product_id),
            rating: Number(row.rating),
            // changed from dateString
            date: Number(row.date),
            summary: String(row.summary),
            body: String(row.body),
            recommend: (0, exports.parseBoolean)(row.recommend),
            reported: (0, exports.parseBoolean)(row.reported),
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
exports.parseReviews = parseReviews;
const addOneReviewToReviews = (review) => {
    const obj = {
        id: Number(review.id),
        'product_id': Number(review.product_id),
        rating: Number(review.rating),
        date: Number(review.date),
        summary: String(review.summary),
        body: String(review.body),
        recommend: (0, exports.parseBoolean)(review.recommend),
        reported: (0, exports.parseBoolean)(review.reported),
        'reviewer_name': String(review.reviewer_name),
        'reviewer_email': String(review.reviewer_email),
        response: String(review.response),
        helpfulness: Number(review.helpfulness)
    };
    Reviews_1.Reviews.insertMany(obj);
};
exports.addOneReviewToReviews = addOneReviewToReviews;
const seedReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default.connect(app_1.url, { dbName: app_2.dbName })
        .then(() => {
        console.log('connected to db');
        (0, exports.parseReviews)();
    })
        .catch((err) => {
        console.log('error connecting to db: ', err);
    });
});
exports.seedReviews = seedReviews;
//# sourceMappingURL=ETLReviews.js.map