import Papa from 'papaparse';
import fs from 'fs';
const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

const readCsv = async (filePath: string, dbName: string, collectionName: string) => {

  const file = fs.createReadStream(filePath);
  console.log('streaming csv file from path: ', filePath);
  // connect to mongo db
  const url = 'mongodb://localhost:27017/test';
  const client = new mongoClient(url);
  const db = client.db(dbName).collection(collectionName);

  // connect to db collection

  await client.connect()
    .then(() => {
      // connect to collection
      console.log('connected to mongo db');
      // use a promise and papaparse to stream file and insert into db. 
      return new Promise((resolve, reject) => {
        Papa.parse(file, {
          worker: true,
          header: true,
          dynamicTyping: true,
          step: function (row) {
            // console.log('Row:', row.data);
            db.insertOne(row)
              .then((result: any) => {
                // console.log('inserted row into db: ', row);
              })
              .catch((err: any) => {
                console.log('error inserting row into db: ', err);
              });
          }, 
          complete: function (results, file) {
            console.log('All done!');
            console.log('results: ', results.data);
            console.log(results);
            resolve(results.data);
            setTimeout(() => { client.close(); }, 1500);
          },
          error: function (err, file) {
            reject(err);
            setTimeout(() => { client.close(); }, 1500);
          }
        });
      });
    })
    .catch((err: any) => {
      console.log('error connecting to mongo db: ', err);
    });
};

const collectionName = 'reviewsCollection';

const reviewsPath = '../reviews.csv';
const reviewsName = 'reviews';

const reviewsPhotosPath = '../reviews_photos.csv';
const reviewsPhotosName = 'reviewsPhotos';

const productPath = '../products.csv';
const productName = 'products';
const dbs = [{path: reviewsPath, name: 'reviewsDB'}, {path: reviewsPhotosPath, name: 'reviewsPhotosDB'}, {path: productPath, name: 'productDB'}];

// readCsv(reviewsPath, 'reviewsDB', collectionName)
//   .then((data) => {
//     console.log('successful parsed data from csv file: ', data);
//   })
//   .catch((err) => {
//     console.log('error from csv file: ', err);
//   });

// create a typescript interface for dbs array of objects
interface Dbs {
  path: string,
  name: string
}


// // use a function with a for loop to read each csv file and insert into db
const createDBs = async (dbs: Dbs[]) => {
  
  await readCsv(reviewsPath, 'reviewsDB', reviewsName)
    .then((data) => {
      console.log('successful parsed data from csv file: ' + reviewsName);
    })
    .catch((err) => {
      console.log('error from csv file: ', err);
    });

  await readCsv(reviewsPhotosPath, 'reviewsDB', reviewsPhotosName)
    .then((data) => {
      console.log('successful parsed data from csv file: ' + reviewsPhotosName);
    })
    .catch((err) => {
      console.log('error from csv file: ', err);
    });
  
  await readCsv(productPath, 'reviewsDB', productName)
    .then((data) => {
      console.log('successful parsed data from csv file: ' + productName);
    })
    .catch((err) => {
      console.log('error from csv file: ', err);
    });

};

createDBs(dbs);