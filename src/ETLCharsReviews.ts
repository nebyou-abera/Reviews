import fs from 'fs';
import papa from 'papaparse';
import { CharReviews } from './CharReviews';
import mongoose from 'mongoose';
import {url} from './app';
import { dbName } from './app';


const charReviewsPath = '../csv/characteristic_reviews.csv';

const parseCharReviews = () => {
  const tempStorage :any[] = [];
  const stream = fs.createReadStream(charReviewsPath);
  const header = {header: true};
  const parsedStream = papa.parse(papa.NODE_STREAM_INPUT, header);
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
    CharReviews.insertMany(tempStorage);
    console.log('first data: ', tempStorage[0]);
    console.log('finished parsing csv file');
  });
};

export const seedCharReviews = async () => {
  mongoose.set('strictQuery', false);
  mongoose.connect(url, {dbName: dbName})
    .then(() => {
      console.log('connected to db');
      parseCharReviews();
    })
    .catch((err) => {
      console.log(err);
    });
};