import Papa from 'papaparse';
import fs from 'fs';
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

const filePath = '../reviews_test.csv';


const readCsv = async (filePath: string, dbName: string) => {
  const url = 'mongodb://localhost:27017/test';
  const client = new mongoClient(url);
  const file = fs.createReadStream(filePath);
  console.log('streaming csv file from path: ', filePath);
  
  // use a promise and papaparse to stream file and insert into db. 
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      worker: true,
      header: true,
      dynamicTyping: true,
      // step: function (row) {
      //   console.log('Row:', row.data);
      // }, 
      complete: function (results, file) {
        console.log('All done!');
        console.log('results: ', results.data);
        console.log(results);
        resolve(results.data);
      },
      error: function (err, file) {
        reject(err);
      }
    });
  });
};

readCsv(filePath, 'reviews_test')
  .then((data) => {
    console.log('successful parsed data from csv file: ', data);
  })
  .catch((err) => {
    console.log('error from csv file: ', err);
  });

/* Install node-mongodb-native by doing:
 *  npm install mongodb
 * See documentation at https://github.com/mongodb/node-mongodb-native
 * Run this command in the terminal to launch mongo server:
 *  mongod --dbpath=/data --port 27017
 * Run this file with:
 *  node mongo-example.js
 */
//connect to mongodb and insert data using mongoose and readCsv function
const insertData = async () => {
  
};