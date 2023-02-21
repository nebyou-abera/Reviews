import fs from 'fs';
import papa from 'papaparse';
import { Reviews } from './Reviews';
import mongoose from 'mongoose';
import {url} from './app';
import { dbName } from './app';
import { ReviewsByProductSchema } from './ReviewsByProduct';
import { parseReviews, seedReviews } from './ETLReviews';
import { Products } from './Products';
import { reviewsPath } from './ETLReviews';
import { parseBoolean } from './ETLReviews';
export const productsPath = '../csv/products.csv';

export const parseProducts = async (path: string) => {
  // seed products collection
  const tempStorage :any[] = [];
  const stream = fs.createReadStream(productsPath);
  const header = {header: true};
  const parsedStream = papa.parse(papa.NODE_STREAM_INPUT, header);
  stream.pipe(parsedStream);

  parsedStream.on('data', (row) => {
    const obj = {
      'product_id': Number(row.id),
      name: String(row.name),
      slogan: String(row.slogan),
      description: String(row.description),
      category: String(row.category),
      'default_price': Number(row.default_price),
      results: []
    };
    tempStorage.push(obj);
  });

  parsedStream.on('end', () => {
    Products.insertMany(tempStorage);
    console.log('first data: ', tempStorage[0]);
    console.log('finished parsing csv file');
  });

  parsedStream.on('error', (err) => {
    console.log(err);
  });
  
};

export const seedReviewsByProduct = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(url, {dbName: dbName, });
    console.log('connected to db');
    await parseProducts(productsPath);
    console.log('products seeded');
  } catch (err) {
    console.log(err);
  }
};

export const addReviewsToProducts = () => {
  mongoose.set('strictQuery', false);
  mongoose.connect(url, {dbName: dbName})
    .then( () => {
      console.log('connected to db');
      const stream = fs.createReadStream(reviewsPath);
      const header = {header: true};
      const parsedStream = papa.parse(papa.NODE_STREAM_INPUT, header);
      stream.pipe(parsedStream);

      parsedStream.on('data', async (row) => {
        const productId = Number(row.product_id);
        // update product at productId with review
        const recommend = parseBoolean(row.recommend);
        const reported = parseBoolean(row.reported);
        const review = {
          id: Number(row.id),
          'product_id': Number(row.product_id),
          rating: Number(row.rating),
          date: Number(row.date),
          summary: String(row.summary),
          body: String(row.body),
          recommend: Boolean(recommend),
          reported: Boolean(reported),
          'reviewer_name': String(row.reviewer_name),
          'reviewer_email': String(row.reviewer_email),
          response: String(row.response),
          helpfulness: Number(row.helpfulness)
        };
        // find product by id and insert review
        // Products.findOneAndUpdate({'product_id': String(productId)}, {$push: {results: review}});
        addOneReviewToProduct(productId, review);
        // console.log('review: ', review);
      });
      
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

export const addOneReviewToProduct = (productId: number, review: any) => {
  // const productId = Number(review.product_id);
  mongoose.set('strictQuery', false);
  mongoose.connect(url, {dbName: dbName})
    .then( () => {
      const recommend = parseBoolean(review.recommend);
      const reported = parseBoolean(review.reported);
      const reviewObj = {
        id: Number(review.id),
        'product_id': Number(review.product_id),
        rating: Number(review.rating),
        date: Number(review.date),
        summary: String(review.summary),
        body: String(review.body),
        recommend: Boolean(recommend),
        reported: Boolean(reported),
        'reviewer_name': String(review.reviewer_name),
        'reviewer_email': String(review.reviewer_email),
        response: String(review.response),
        helpfulness: Number(review.helpfulness)
      };
      Products.findOneAndUpdate({'product_id': Number(productId)}, {$push: {results: reviewObj}})
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

// retrieve all reviews by product id
export const getReviewsByProductId = async (productId: number) => {
  mongoose.set('strictQuery', false);
  mongoose.connect(url, {dbName: dbName})
    .then( () => {
      Products.findOne({'product_id': Number(productId)})
        .then((data) => {
          console.log('in getReviewsByProductId retrieved data: ', data);
          // convert data into correct format
          return data;
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};



// seed products collection from csv file
// seedReviewsByProduct();

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

// add all of the reviews in csv to the products collection
// addReviewsToProducts();