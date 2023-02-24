import fs from 'fs';
import papa from 'papaparse';
import { Reviews } from './Reviews';
import mongoose from 'mongoose';
import { url } from './app';
import { dbName } from './app';
import { ReviewsByProductSchema } from './ReviewsByProduct';
import { parseReviews, seedReviews } from './ETLReviews';
import { Products } from './Products';
import { reviewsPath } from './ETLReviews';
import { parseBoolean } from './ETLReviews';
import { photosPath } from './ETLPhotos';
export const productsPath = '../csv/products.csv';

export const parseProducts = async (path: string) => {
  // seed products collection
  const tempStorage: any[] = [];
  const stream = fs.createReadStream(productsPath);
  const header = { header: true };
  const parsedStream = papa.parse(papa.NODE_STREAM_INPUT, header);
  stream.pipe(parsedStream);

  parsedStream.on('data', (row) => {
    const obj = {
      product_id: Number(row.id),
      name: String(row.name),
      slogan: String(row.slogan),
      description: String(row.description),
      category: String(row.category),
      default_price: Number(row.default_price),
      results: []
    };
    tempStorage.push(obj);
  });

  parsedStream.on('end', () => {
    Products.insertMany(tempStorage)
      .then(() => {
        console.log('first data: ', tempStorage[0]);
        console.log('finished parsing csv file');
      })
      .catch((err) => {
        console.log('error inserting products into db: ', err);
      });
  });

  parsedStream.on('error', (err) => {
    console.log(err);
  });
};

export const seedProducts = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(url, { dbName: dbName });
    console.log('connected to db');
    await parseProducts(productsPath);
    console.log('products seeded');
  } catch (err) {
    console.log(err);
  }
};

export const addReviewsToProducts = () => {
  let count = 0;
  mongoose.set('strictQuery', false);
  mongoose
    .connect(url, { dbName: dbName })
    .then(() => {
      console.log('connected to db');
      const stream = fs.createReadStream(reviewsPath);
      const header = { header: true };
      const parsedStream = papa.parse(papa.NODE_STREAM_INPUT, header);
      stream.pipe(parsedStream);

      parsedStream.on('data', async (row) => {
        count += 1;
        const productId = Number(row.product_id);
        // update product at productId with review
        const recommend = parseBoolean(row.recommend);
        const reported = parseBoolean(row.reported);
        const review = {
          id: Number(row.id),
          product_id: Number(row.product_id),
          rating: Number(row.rating),
          date: Number(row.date),
          summary: String(row.summary),
          body: String(row.body),
          recommend: Boolean(recommend),
          reported: Boolean(reported),
          reviewer_name: String(row.reviewer_name),
          reviewer_email: String(row.reviewer_email),
          response: String(row.response),
          helpfulness: Number(row.helpfulness),
          photos: []
        };
        // find product by id and insert review
        // Products.findOneAndUpdate({'product_id': String(productId)}, {$push: {results: review}});
        // addOneReviewToProduct(productId, review);
        Products.findOneAndUpdate({ product_id: Number(productId) }, { $push: { results: review } })
          .then(() => {
            // console.log('review added to product: ', productId);
            if (count % 50000 === 0) {
              console.log('finished adding review to product : ', count);
            }
          })
          .catch((err) => {
            console.log('error adding review to product: ', err);
          });
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

export const addPhotoToReview = (reviewId: number, photo: any) => {
  mongoose.set('strictQuery', false);
  mongoose
    .connect(url, { dbName: dbName })
    .then(() => {
      // find review by id and insert photo
      Products.findOneAndUpdate(
        { 'results.id': Number(reviewId) },
        { $push: { 'results.$.photos': photo } }
      )
        .then((data) => {
          console.log('added photo to review');
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

// // test addPhotoToReview
// const photo1 = {
//   id: 1,
//   'review_id': 1,
//   url: 'https://images.unsplash.com/photo-1558987900-8c7a5a2d1e9c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80'
// };
// addPhotoToReview(1, photo1);

export const addPhotosToProduct = () => {
  let count = 0;
  mongoose.set('strictQuery', false);
  mongoose
    .connect(url, { dbName: dbName })
    .then(() => {
      const stream = fs.createReadStream(photosPath);
      const header = { header: true };
      const parsedStream = papa.parse(papa.NODE_STREAM_INPUT, header);
      stream.pipe(parsedStream);

      parsedStream.on('data', (row) => {
        count += 1;
        const reviewId = Number(row.review_id);
        const obj = {
          id: Number(row.id),
          review_id: Number(row.review_id),
          url: String(row.url)
        };
        // tempStorage.push(obj);
        // find review by id and insert photos
        Products.findOneAndUpdate(
          { 'results.id': Number(reviewId) },
          { $push: { 'results.$.photos': obj } }
        )
          .then((data) => {
            if (count % 50000 === 0) {
              console.log('finished adding photo to review ' + reviewId + ' count is at ' + count);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });

      parsedStream.on('end', () => {
        console.log('finished parsing csv file');
      });

      parsedStream.on('error', (err) => {
        console.log('encountered error parsing reviews into products ', err);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const addOneReviewToProduct = (productId: number, review: any) => {
  // const productId = Number(review.product_id);
  mongoose.set('strictQuery', false);
  mongoose
    .connect(url, { dbName: dbName })
    .then(() => {
      const recommend = parseBoolean(review.recommend);
      const reported = parseBoolean(review.reported);
      const reviewObj = {
        id: Number(review.id),
        product_id: Number(review.product_id),
        rating: Number(review.rating),
        date: Number(review.date),
        summary: String(review.summary),
        body: String(review.body),
        recommend: Boolean(recommend),
        reported: Boolean(reported),
        reviewer_name: String(review.reviewer_name),
        reviewer_email: String(review.reviewer_email),
        response: String(review.response),
        helpfulness: Number(review.helpfulness),
        photos: []
      };
      Products.findOneAndUpdate(
        { product_id: Number(productId) },
        { $push: { results: reviewObj } }
      )
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
export const getReviewsByProductId = (productId: number) => {
  return new Promise((resolve, reject) => {
    mongoose.set('strictQuery', false);
    mongoose
      .connect(url, { dbName: dbName })
      .then(() => {
        Products.findOne({ product_id: Number(productId) })
          .then((data) => {
            // console.log('in getReviewsByProductId retrieved data: ', data);
            // convert data into correct format
            resolve(data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

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

// show the command to display the size of node's heap memory in max-old-space-size
// node -e 'console.log(`node heap limit = ${require("v8").getHeapStatistics().heap_size_limit / (1024 * 1024)} Mb`)'

// command to run operations using optimized memory --optimize-for-size
// node --optimize-for-size --max-old-space-size=13000 ETLProducts.js
// node --max-old-space-size=13000 ETLProducts.js

// seed products collection from csv file
// seedProducts();

// add all of the reviews in csv to the products collection
// addReviewsToProducts();

// add all of the photos in csv to the products collection
addPhotosToProduct();
