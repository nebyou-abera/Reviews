import {Schema, model} from 'mongoose';

const photosCollectionName = 'photos';

export const PhotosSchema: Schema = new Schema({
  id: Number,
  'review_id': Number,
  url: String
});

export const Photos = model<typeof PhotosSchema>(photosCollectionName, PhotosSchema);