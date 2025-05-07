import express from 'express';
const router = express.Router();
import {
  queryOpenAIEmbedding,
  queryOpenAIChat,
} from './controllers/openaiController.js';
import { parseUserQuery } from './controllers/userQueryController.js';
import { queryPineconeDatabase } from './controllers/pineconeController.js';

router.post(
  '/api',
  parseUserQuery,
  queryOpenAIEmbedding,
  queryPineconeDatabase,
  queryOpenAIChat,
  (_req, res) => {
    res.status(200).json({ amswer: res.locals.answer });
  }
);

export default router;
