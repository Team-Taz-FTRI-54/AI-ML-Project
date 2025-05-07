import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import 'dotenv/config';

import { ServerError } from '../types/types.js';

import { Request, Response, NextFunction } from 'express';

import searchRoute from './seachRoute.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/', searchRoute, (_req, res) => {
  res.status(200).json({
    movieRecommendation: res.locals.movieRecommendation,
    //'Wishmaster - A malevolent genie wreaks havoc after being freed, leading to a battle between his dark desires and those trying to stop him.',
  });
});

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
