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
exports.getReviewsByProductId = exports.addOneReviewToProduct = exports.addReviewsToProducts = exports.seedReviewsByProduct = exports.parseProducts = exports.productsPath = void 0;
const fs_1 = __importDefault(require("fs"));
const papaparse_1 = __importDefault(require("papaparse"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const app_2 = require("./app");
const Products_1 = require("./Products");
const ETLReviews_1 = require("./ETLReviews");
const ETLReviews_2 = require("./ETLReviews");
exports.productsPath = '../csv/products.csv';
const parseProducts = (path) => __awaiter(void 0, void 0, void 0, function* () {
    // seed products collection
    const tempStorage = [];
    const stream = fs_1.default.createReadStream(exports.productsPath);
    const header = { header: true };
    const parsedStream = papaparse_1.default.parse(papaparse_1.default.NODE_STREAM_INPUT, header);
    stream.pipe(parsedStream);
    parsedStream.on('data', (row) => {
        const obj = {
            'product_id': Number(row.id),
            name: String(row.name),
            slogan: String(row.slogan),
            description: String(row.description),
            category: String(row.category),
            'default_price': Number(row.default_price),
            results: []
        };
        tempStorage.push(obj);
    });
    parsedStream.on('end', () => {
        Products_1.Products.insertMany(tempStorage);
        console.log('first data: ', tempStorage[0]);
        console.log('finished parsing csv file');
    });
    parsedStream.on('error', (err) => {
        console.log(err);
    });
});
exports.parseProducts = parseProducts;
const seedReviewsByProduct = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongoose_1.default.set('strictQuery', false);
        yield mongoose_1.default.connect(app_1.url, { dbName: app_2.dbName, });
        console.log('connected to db');
        yield (0, exports.parseProducts)(exports.productsPath);
        console.log('products seeded');
    }
    catch (err) {
        console.log(err);
    }
});
exports.seedReviewsByProduct = seedReviewsByProduct;
const addReviewsToProducts = () => {
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default.connect(app_1.url, { dbName: app_2.dbName })
        .then(() => {
        console.log('connected to db');
        const stream = fs_1.default.createReadStream(ETLReviews_1.reviewsPath);
        const header = { header: true };
        const parsedStream = papaparse_1.default.parse(papaparse_1.default.NODE_STREAM_INPUT, header);
        stream.pipe(parsedStream);
        parsedStream.on('data', (row) => __awaiter(void 0, void 0, void 0, function* () {
            const productId = Number(row.product_id);
            // update product at productId with review
            const recommend = (0, ETLReviews_2.parseBoolean)(row.recommend);
            const reported = (0, ETLReviews_2.parseBoolean)(row.reported);
            const review = {
                id: Number(row.id),
                'product_id': Number(row.product_id),
                rating: Number(row.rating),
                date: Number(row.date),
                summary: String(row.summary),
                body: String(row.body),
                recommend: Boolean(recommend),
                reported: Boolean(reported),
                'reviewer_name': String(row.reviewer_name),
                'reviewer_email': String(row.reviewer_email),
                response: String(row.response),
                helpfulness: Number(row.helpfulness)
            };
            // find product by id and insert review
            // Products.findOneAndUpdate({'product_id': String(productId)}, {$push: {results: review}});
            (0, exports.addOneReviewToProduct)(productId, review);
            // console.log('review: ', review);
        }));
        parsedStream.on('end', () => {
            console.log('finished parsing csv file');
        });
        parsedStream.on('error', (err) => {
            console.log('encountered error parsing reviews into products');
        });
    })
        .catch((err) => {
        console.log(err);
    });
};
exports.addReviewsToProducts = addReviewsToProducts;
const addOneReviewToProduct = (productId, review) => {
    // const productId = Number(review.product_id);
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default.connect(app_1.url, { dbName: app_2.dbName })
        .then(() => {
        const recommend = (0, ETLReviews_2.parseBoolean)(review.recommend);
        const reported = (0, ETLReviews_2.parseBoolean)(review.reported);
        const reviewObj = {
            id: Number(review.id),
            'product_id': Number(review.product_id),
            rating: Number(review.rating),
            date: Number(review.date),
            summary: String(review.summary),
            body: String(review.body),
            recommend: Boolean(recommend),
            reported: Boolean(reported),
            'reviewer_name': String(review.reviewer_name),
            'reviewer_email': String(review.reviewer_email),
            response: String(review.response),
            helpfulness: Number(review.helpfulness)
        };
        Products_1.Products.findOneAndUpdate({ 'product_id': Number(productId) }, { $push: { results: reviewObj } })
            .then(() => {
            console.log('review added to product: ', productId);
        })
            .catch((err) => {
            console.log('error adding review to product: ', err);
        });
    })
        .catch((err) => {
        console.log(err);
    });
};
exports.addOneReviewToProduct = addOneReviewToProduct;
// retrieve all reviews by product id
const getReviewsByProductId = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default.connect(app_1.url, { dbName: app_2.dbName })
        .then(() => {
        Products_1.Products.findOne({ 'product_id': Number(productId) })
            .then((data) => {
            console.log('in getReviewsByProductId retrieved data: ', data);
            return data;
        })
            .catch((err) => {
            console.log(err);
        });
    })
        .catch((err) => {
        console.log(err);
    });
});
exports.getReviewsByProductId = getReviewsByProductId;
// seed products collection from csv file
// seedReviewsByProduct();
// add one review to the first product as a test
// addOneReviewToProduct(1, {
//   id: 5,
//   'product_id': 1,
//   rating: 5,
//   date: 1586080000000,
//   summary: 'Test 2',
//   body: 'this product met my expectations',
//   recommend: true,
//   reported: false,
//   'reviewer_name': 'Nurse Test',
//   'reviewer_email': 'nursetest@gmail.com',
//   response: 'thank you big nurse',
//   helpfulness: 7,
// });
// add all of the reviews in csv to the products collection
// addReviewsToProducts();
//# sourceMappingURL=ETLProducts.js.map