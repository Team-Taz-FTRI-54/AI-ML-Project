import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

//Set up database

//const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   throw new Error('MONGO_URI is not defined');
// }

mongoose
  .connect(`${process.env.MONGO_URI}`, {
    // options for the connect method to parse the URI
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    dbName: 'test', //!pending for db name
  })
  .then(() => console.log('👌👌 MongoDB connected'))
  .catch((err) => console.log('👎🏻👎🏻 MongoDB connection error:', err.message));

// Listener
const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, '0.0.0.0', () =>
  console.log(`🎁🎁🎁 Server running on port ${PORT}`)
);
