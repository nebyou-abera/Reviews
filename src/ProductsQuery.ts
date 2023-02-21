import {Schema, model} from 'mongoose';
import { ReviewsByProductSchema } from './ReviewsByProduct';

const productsCollectionName = 'products';

export const ProductsSchema: Schema = new Schema({
  'product_id': String,
  results: [ReviewsByProductSchema]
});

export const Photos = model<typeof ProductsSchema>(productsCollectionName, ProductsSchema);

