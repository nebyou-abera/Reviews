import {Schema, model} from 'mongoose';

const photosCollectionName = 'photosByReview';

export const PhotosByReviewSchema: Schema = new Schema({
  'id': Number,
  url: String
});

export const Photos = model<typeof PhotosByReviewSchema>(photosCollectionName, PhotosByReviewSchema);