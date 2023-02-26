import express from 'express';
import * as dotenv from 'dotenv';
import { getReviewsByProductId } from './ETLProducts';
dotenv.config();
// import axios from 'axios';
// import * as path from 'path';
// import mongoose from 'mongoose';
// import cors from 'cors';

export const dbName = 'reviewsDevelopment';
export const url = `mongodb://127.0.0.1:27017/${dbName}`;

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

console.log(__dirname);
console.log(process.env.PORT);

app.get('/reviews', async (req, res) => {
  const productId = Number(req.query.product_id);
  // const page = Number(req.query.page);
  // const count = Number(req.query.count);

  const data: any = await getReviewsByProductId(productId);
  // convert data into correct response format
  const results = data.results.map((review: any) => {
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
      photos: review.photos.map((photo: any) => {
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
