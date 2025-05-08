import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import mongoose from 'mongoose';

//Set up database

mongoose
  .connect(`${process.env.MONGO_URI}`, {
    // options for the connect method to parse the URI
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    dbName: 'AskYourPDF',
  })
  .then(() => console.log('👌👌 MongoDB connected'))
  .catch((err) => console.log('👎🏻👎🏻 MongoDB connection error:', err.message));
console.log('Connecting to MongoDB with URI:', process.env.PORT);
console.log('Current working directory:', process.cwd());
// Listener
const PORT = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, '0.0.0.0', () =>
  console.log(`🎁🎁🎁 Server running on port ${PORT}`)
);
