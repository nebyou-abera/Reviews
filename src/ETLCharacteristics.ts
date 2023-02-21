import fs from 'fs';
import papa from 'papaparse';
import { Characteristics } from './Characteristics';
import mongoose from 'mongoose';
import {url} from './app';
import { dbName } from './app';


const characteristicsPath = '../csv/characteristics.csv';

const parseCharacteristics = () => {
  const tempStorage :any[] = [];
  const stream = fs.createReadStream(characteristicsPath);
  const header = {header: true};
  const parsedStream = papa.parse(papa.NODE_STREAM_INPUT, header);
  stream.pipe(parsedStream);

  parsedStream.on('data', (row) => {
    const obj = {
      id: Number(row.id),
      'product_id': Number(row.product_id),
      name: String(row.name)
    };
    tempStorage.push(obj);
  });

  parsedStream.on('end', () => {
    Characteristics.insertMany(tempStorage);
    console.log('first data: ', tempStorage[0]);
    console.log('finished parsing csv file');
  });
};

// retrieve characteristics from db
export const getCharacteristics = async (productId: number) => {
  const characteristics = await Characteristics.find({'product_id': productId});
  return characteristics;
};

export const seedCharacteristics = async () => {
  mongoose.set('strictQuery', false);
  mongoose.connect(url, {dbName: dbName})
    .then(() => {
      console.log('connected to db');
      parseCharacteristics();
    })
    .catch((err) => {
      console.log(err);
    });
};