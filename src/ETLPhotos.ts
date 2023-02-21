import fs from 'fs';
import papa from 'papaparse';
import mongoose from 'mongoose';
import {url} from './app';
import { dbName } from './app';
import { Photos } from './Photos';

const photosPath = '../csv/reviews_photos.csv';

const parsePhotos = () => {
  const tempStorage :any[] = [];
  const stream = fs.createReadStream(photosPath);
  const header = {header: true};
  const parsedStream = papa.parse(papa.NODE_STREAM_INPUT, header);
  stream.pipe(parsedStream);

  parsedStream.on('data', (row) => {
    const obj = {
      id: Number(row.id),
      'review_id': Number(row.review_id),
      url: String(row.url)
    };
    tempStorage.push(obj);
  });

  parsedStream.on('end', () => {
    Photos.insertMany(tempStorage);
    console.log('first data: ', tempStorage[0]);
    console.log('finished parsing csv file');
  });
};

export const seedPhotos = async () => {
  mongoose.set('strictQuery', false);
  mongoose.connect(url, {dbName: dbName})
    .then(() => {
      console.log('connected to db');
      parsePhotos();
    })
    .catch((err) => {
      console.log(err);
    });
};