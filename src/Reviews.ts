import {Schema, model} from 'mongoose';
import { Photos, PhotosSchema } from './Photos';

const reviewsCollectionName = 'reviews';

export const ReviewsSchema: Schema = new Schema({
  id: {type: Number, required: false},
  'product_id': Number,
  rating: Number,
  date: Number,
  summary: String,
  body: String,
  recommend: Boolean,
  reported: Boolean,
  'reviewer_name': String,
  'reviewer_email': String,
  response: String,
  helpfulness: Number,
  photos: {type: [PhotosSchema], required: false}
});

export const Reviews = model<typeof ReviewsSchema>(reviewsCollectionName, ReviewsSchema);