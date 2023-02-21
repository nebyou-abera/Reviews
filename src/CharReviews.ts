import {Schema, model} from 'mongoose';

const charReviewsCollectionName = 'charReviews';

export const CharReviewsSchema: Schema = new Schema({
  id: Number,
  'characteristic_id': Number,
  'review_id': Number,
  value: String
});

export const CharReviews = model<typeof CharReviewsSchema>(charReviewsCollectionName, CharReviewsSchema);