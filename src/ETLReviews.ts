import fs from 'fs';
import papa from 'papaparse';
import { Reviews } from './Reviews';
import mongoose from 'mongoose';
import {url} from './app';
import { dbName } from './app';

export const reviewsPath = '../csv/reviews.csv';

// make a function that convers strings of true or false to boolean
export const parseBoolean = (str: string) => {
  if (str === 'true' || str === 'TRUE' || str === 'True') {
    return true;
  } else {
    return false;
  }
};

export const parseReviews = (path = reviewsPath) => {
  const tempStorage :any[] = [];
  const stream = fs.createReadStream(path);
  const header = {header: true};
  const parsedStream = papa.parse(papa.NODE_STREAM_INPUT, header);
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
    Reviews.insertMany(tempStorage);
    console.log('first data: ', tempStorage[0]);
    console.log('finished parsing csv file');
  });
};

export const addOneReviewToReviews = (review: any) => {
  const obj = {
    id: Number(review.id),
    'product_id': Number(review.product_id),
    rating: Number(review.rating),
    date: Number(review.date),
    summary: String(review.summary),
    body: String(review.body),
    recommend: parseBoolean(review.recommend),
    reported: parseBoolean(review.reported),
    'reviewer_name': String(review.reviewer_name),
    'reviewer_email': String(review.reviewer_email),
    response: String(review.response),
    helpfulness: Number(review.helpfulness)
  };
  Reviews.insertMany(obj);
};

export const seedReviews = async () => {
  mongoose.set('strictQuery', false);
  mongoose.connect(url, {dbName: dbName})
    .then(() => {
      console.log('connected to db');
      parseReviews();
    })
    .catch((err) => {
      console.log('error connecting to db: ', err);
    });
};