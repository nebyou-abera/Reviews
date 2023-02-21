import {Schema, model} from 'mongoose';
import {Photos} from './Photos';
import { PhotosByReviewSchema } from './PhotosByReview';

const reviewsCollectionName = 'reviewsByProduct';

export const ReviewsByProductSchema: Schema = new Schema({
  'review_id': Number,
  rating: Number,
  summary: String,
  recommend: Boolean,
  response: String,
  body: String,
  date: String,
  'reviewer_name': String,
  helpfulness: Number,
  photos: {type: [PhotosByReviewSchema], required: false}
});

export const Reviews = model<typeof ReviewsByProductSchema>(reviewsCollectionName, ReviewsByProductSchema);