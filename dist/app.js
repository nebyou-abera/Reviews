"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.url = exports.dbName = void 0;
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const ETLProducts_1 = require("./ETLProducts");
dotenv.config();
// import axios from 'axios';
// import * as path from 'path';
// import mongoose from 'mongoose';
// import cors from 'cors';
exports.dbName = 'reviewsDevelopment';
exports.url = `mongodb://127.0.0.1:27017/${exports.dbName}`;
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
console.log(__dirname);
console.log(process.env.PORT);
app.get('/reviews', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = Number(req.query.product_id);
    // const page = Number(req.query.page);
    // const count = Number(req.query.count);
    const data = yield (0, ETLProducts_1.getReviewsByProductId)(productId);
    // convert data into correct response format
    const results = data.results.map((review) => {
        // convert date to ISO string
        const date = new Date(review.date);
        const dateString = date.toISOString();
        return {
            review_id: review.id,
            rating: review.rating,
            summary: review.summary,
            recommend: review.recommend,
            response: review.response,
            body: review.body,
            date: dateString,
            reviewer_name: review.reviewer_name,
            helpfulness: review.helpfulness,
            photos: review.photos.map((photo) => {
                return {
                    id: photo.id,
                    url: photo.url
                };
            })
        };
    });
    const answerObj = {
        product: data.product_id,
        page: 1,
        count: 5,
        results: results
    };
    // console.log('answerObj: ', answerObj);
    res.send(answerObj);
}));
app.post('/reviews', (req, res) => {
    // postReview(req.body)
    //   .then((review: any) => {
    //     console.log('successfully added review');
    //   })
    //   .catch((err: any) => {
    //     console.log('there was an error adding review', err);
    //   });
});
app.get('/reviews/meta', (req, res) => {
    const productId = req.query.productId;
    // getMetaByProductId(productId)
    //   .then((meta: any) => {
    //     console.log('successfully retrieved meta');
    //   })
    //   .catch((err: any) => {
    //     console.log('there was an error retrieving meta', err);
    //   });
});
app.put('/reviews/:review_id/helpful', (req, res) => {
    // markHelpfulReview(req.body.reviewId)
    //   .then((review: any) => {
    //     console.log('successfully marked review helpful');
    //   })
    //   .catch((err: any) => {
    //     console.log('there was an error marking review helpful', err);
    //   });
});
app.put('/reviews/:review_id/report', (req, res) => {
    // req.params.review_id
    // reportReview(req.body.reviewId)
    //   .then((review: any) => {
    //     console.log('successfully reported review');
    //   })
    //   .catch((err: any) => {
    //     console.log('there was an error reporting review', err);
    //   });
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map