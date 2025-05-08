import express from 'express';
const router = express.Router();
import {
  queryOpenAIEmbedding,
  queryOpenAIChat,
} from '../controllers/openaiController.js';
import { parseUserQuery } from '../controllers/userQueryController.js';
import { queryPineconeDatabase } from '../controllers/pineconeController.js';
import { getProfile } from '../controllers/loggingController.js';

router.post(
  '/api/query',
  parseUserQuery,
  queryOpenAIEmbedding,
  queryPineconeDatabase,
  queryOpenAIChat,

  (_req, res) => {
    res.status(200).json({ answer: res.locals.answer });
  }
);

router.get('/api/query', getProfile, (_req, res) => {
  res.status(200).json({ profile: res.locals.profile });
});

export default router;
