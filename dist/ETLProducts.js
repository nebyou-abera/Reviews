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
exports.getReviewsByProductId = exports.addOneReviewToProduct = exports.addPhotosToProduct = exports.addPhotoToReview = exports.addReviewsToProducts = exports.seedProducts = exports.parseProducts = exports.productsPath = void 0;
const fs_1 = __importDefault(require("fs"));
const papaparse_1 = __importDefault(require("papaparse"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const app_2 = require("./app");
const Products_1 = require("./Products");
const ETLReviews_1 = require("./ETLReviews");
const ETLReviews_2 = require("./ETLReviews");
const ETLPhotos_1 = require("./ETLPhotos");
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
            product_id: Number(row.id),
            name: String(row.name),
            slogan: String(row.slogan),
            description: String(row.description),
            category: String(row.category),
            default_price: Number(row.default_price),
            results: []
        };
        tempStorage.push(obj);
    });
    parsedStream.on('end', () => {
        Products_1.Products.insertMany(tempStorage)
            .then(() => {
            console.log('first data: ', tempStorage[0]);
            console.log('finished parsing csv file');
        })
            .catch((err) => {
            console.log('error inserting products into db: ', err);
        });
    });
    parsedStream.on('error', (err) => {
        console.log(err);
    });
});
exports.parseProducts = parseProducts;
const seedProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongoose_1.default.set('strictQuery', false);
        yield mongoose_1.default.connect(app_1.url, { dbName: app_2.dbName });
        console.log('connected to db');
        yield (0, exports.parseProducts)(exports.productsPath);
        console.log('products seeded');
    }
    catch (err) {
        console.log(err);
    }
});
exports.seedProducts = seedProducts;
const addReviewsToProducts = () => {
    let count = 0;
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default
        .connect(app_1.url, { dbName: app_2.dbName })
        .then(() => {
        console.log('connected to db');
        const stream = fs_1.default.createReadStream(ETLReviews_1.reviewsPath);
        const header = { header: true };
        const parsedStream = papaparse_1.default.parse(papaparse_1.default.NODE_STREAM_INPUT, header);
        stream.pipe(parsedStream);
        parsedStream.on('data', (row) => __awaiter(void 0, void 0, void 0, function* () {
            count += 1;
            const productId = Number(row.product_id);
            // update product at productId with review
            const recommend = (0, ETLReviews_2.parseBoolean)(row.recommend);
            const reported = (0, ETLReviews_2.parseBoolean)(row.reported);
            const review = {
                id: Number(row.id),
                product_id: Number(row.product_id),
                rating: Number(row.rating),
                date: Number(row.date),
                summary: String(row.summary),
                body: String(row.body),
                recommend: Boolean(recommend),
                reported: Boolean(reported),
                reviewer_name: String(row.reviewer_name),
                reviewer_email: String(row.reviewer_email),
                response: String(row.response),
                helpfulness: Number(row.helpfulness),
                photos: []
            };
            // find product by id and insert review
            // Products.findOneAndUpdate({'product_id': String(productId)}, {$push: {results: review}});
            // addOneReviewToProduct(productId, review);
            Products_1.Products.findOneAndUpdate({ product_id: Number(productId) }, { $push: { results: review } })
                .then(() => {
                // console.log('review added to product: ', productId);
                if (count % 50000 === 0) {
                    console.log('finished adding review to product : ', count);
                }
            })
                .catch((err) => {
                console.log('error adding review to product: ', err);
            });
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
const addPhotoToReview = (reviewId, photo) => {
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default
        .connect(app_1.url, { dbName: app_2.dbName })
        .then(() => {
        // find review by id and insert photo
        Products_1.Products.findOneAndUpdate({ 'results.id': Number(reviewId) }, { $push: { 'results.$.photos': photo } })
            .then((data) => {
            console.log('added photo to review');
        })
            .catch((err) => {
            console.log(err);
        });
    })
        .catch((err) => {
        console.log(err);
    });
};
exports.addPhotoToReview = addPhotoToReview;
// // test addPhotoToReview
// const photo1 = {
//   id: 1,
//   'review_id': 1,
//   url: 'https://images.unsplash.com/photo-1558987900-8c7a5a2d1e9c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
// };
// addPhotoToReview(1, photo1);
const addPhotosToProduct = () => {
    let count = 0;
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default
        .connect(app_1.url, { dbName: app_2.dbName })
        .then(() => {
        const stream = fs_1.default.createReadStream(ETLPhotos_1.photosPath);
        const header = { header: true };
        const parsedStream = papaparse_1.default.parse(papaparse_1.default.NODE_STREAM_INPUT, header);
        stream.pipe(parsedStream);
        parsedStream.on('data', (row) => {
            count += 1;
            const reviewId = Number(row.review_id);
            const obj = {
                id: Number(row.id),
                review_id: Number(row.review_id),
                url: String(row.url)
            };
            // tempStorage.push(obj);
            // find review by id and insert photos
            Products_1.Products.findOneAndUpdate({ 'results.id': Number(reviewId) }, { $push: { 'results.$.photos': obj } })
                .then((data) => {
                if (count % 50000 === 0) {
                    console.log('finished adding photo to review ' + reviewId + ' count is at ' + count);
                }
            })
                .catch((err) => {
                console.log(err);
            });
        });
        parsedStream.on('end', () => {
            console.log('finished parsing csv file');
        });
        parsedStream.on('error', (err) => {
            console.log('encountered error parsing reviews into products ', err);
        });
    })
        .catch((err) => {
        console.log(err);
    });
};
exports.addPhotosToProduct = addPhotosToProduct;
const addOneReviewToProduct = (productId, review) => {
    // const productId = Number(review.product_id);
    mongoose_1.default.set('strictQuery', false);
    mongoose_1.default
        .connect(app_1.url, { dbName: app_2.dbName })
        .then(() => {
        const recommend = (0, ETLReviews_2.parseBoolean)(review.recommend);
        const reported = (0, ETLReviews_2.parseBoolean)(review.reported);
        const reviewObj = {
            id: Number(review.id),
            product_id: Number(review.product_id),
            rating: Number(review.rating),
            date: Number(review.date),
            summary: String(review.summary),
            body: String(review.body),
            recommend: Boolean(recommend),
            reported: Boolean(reported),
            reviewer_name: String(review.reviewer_name),
            reviewer_email: String(review.reviewer_email),
            response: String(review.response),
            helpfulness: Number(review.helpfulness),
            photos: []
        };
        Products_1.Products.findOneAndUpdate({ product_id: Number(productId) }, { $push: { results: reviewObj } })
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
const getReviewsByProductId = (productId) => {
    return new Promise((resolve, reject) => {
        mongoose_1.default.set('strictQuery', false);
        mongoose_1.default
            .connect(app_1.url, { dbName: app_2.dbName })
            .then(() => {
            Products_1.Products.findOne({ product_id: Number(productId) })
                .then((data) => {
                // console.log('in getReviewsByProductId retrieved data: ', data);
                // convert data into correct format
                resolve(data);
            })
                .catch((err) => {
                console.log(err);
            });
        })
            .catch((err) => {
            reject(err);
        });
    });
};
exports.getReviewsByProductId = getReviewsByProductId;
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
// show the command to display the size of node's heap memory in max-old-space-size
// node -e 'console.log(`node heap limit = ${require("v8").getHeapStatistics().heap_size_limit / (1024 * 1024)} Mb`)'
// command to run operations using optimized memory --optimize-for-size
// node --optimize-for-size --max-old-space-size=13000 ETLProducts.js
// node --max-old-space-size=13000 ETLProducts.js
// seed products collection from csv file
// seedProducts();
// add all of the reviews in csv to the products collection
// addReviewsToProducts();
// add all of the photos in csv to the products collection
(0, exports.addPhotosToProduct)();
//# sourceMappingURL=ETLProducts.js.map