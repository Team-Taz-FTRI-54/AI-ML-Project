import { RequestHandler } from 'express';
import { ServerError } from '../../types/types.js';
import Logs from '../models/logmodel.js';

const logQuery: RequestHandler = async (_req, res, next) => {
  const { promptText, promptType, embedding, pineconeQueryResult } = res.locals;
};
