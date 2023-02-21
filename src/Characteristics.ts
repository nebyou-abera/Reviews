import {Schema, model} from 'mongoose';

const characteristicsCollectionName = 'characteristics';

export const CharacteristicsSchema: Schema = new Schema({
  id: Number,
  'product_id': Number,
  name: String
});

export const Characteristics = model<typeof CharacteristicsSchema>(characteristicsCollectionName, CharacteristicsSchema);