import {Schema, model} from 'mongoose';
import { Reviews, ReviewsSchema } from './Reviews';
import { ReviewsByProductSchema } from './ReviewsByProduct';

const productsCollectionName = 'products';

export const ProductsSchema: Schema = new Schema({
  'product_id': Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  'default_price': Number,
  // page: Number,
  // count: Number,
  results: {type: [ReviewsSchema], required: false}
});

export const Products = model<typeof ProductsSchema>(productsCollectionName, ProductsSchema);

