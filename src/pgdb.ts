// const {client} = require('pg')
// const lineByLine = require('n-readlines')
// const connectDB = async () => {
//   try {
//     const client = new Client({
//       host: 'localhost',
//       user: 'neb',
//       password: 'password',
//       database: 'testreviews'
//     });
//     await client.connect();

//     const res = await lineByLine('reviews.csv');
//     console.log(res);
//   } catch (err) {
//     console.log(err);
//   }
// }

// connectDB();