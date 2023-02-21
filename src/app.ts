import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import * as path from 'path';
import mongoose from 'mongoose';
import { getReviewsByProductId } from './ETLProducts';
// import cors from 'cors';

export const dbName = 'reviewsDevelopment';
export const url = `mongodb://localhost:27017/${dbName}`;


const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

console.log(__dirname);
console.log(process.env.PORT);

app.get('/reviews', async (req, res) => {
  const productId = Number(req.query.product_id);
  // const page = Number(req.query.page);
  // const count = Number(req.query.count);
  // const sort = req.query.sort;
  console.log('in get reviews productId: ', productId);
  getReviewsByProductId(productId)
    .then((data) => {
      console.log('in getReviewsByProductId retrieved data: ', data);
      //convert data to correct format
      
      res.send(data);
    });
});

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
