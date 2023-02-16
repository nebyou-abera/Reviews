import express from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import * as path from 'path';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

console.log(__dirname);
console.log(process.env.PORT);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});