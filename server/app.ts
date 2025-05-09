import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { ServerError } from '../types/types.js';
import { Request, Response, NextFunction } from 'express';

import uploadRoute from './routes/uploadRoute.js';
import searchRoute from './routes/seachRoute.js';
import userRoute from './routes/userRoute.js';

const app = express();

app.use(cors());
app.use(express.json());


// Must be app.use to use middleware
app.use('/', searchRoute);

app.use('/api', uploadRoute);

app.use('/', searchRoute);

app.use('/', userRoute);

const errorHandler: ErrorRequestHandler = (
  err: ServerError,
  _req,
  res,
  _next
) => {
  const defaultErr: ServerError = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj: ServerError = { ...defaultErr, ...err };
  console.log(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
};

app.use(errorHandler);

export default app;
