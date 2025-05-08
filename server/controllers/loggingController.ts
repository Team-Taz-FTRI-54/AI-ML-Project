import { RequestHandler } from 'express';
import { ServerError } from '../../types/types.js';
import Logs from '../models/logModel.js';

export const logQuery: RequestHandler = async (req, res, next) => {
  const { promptText, promptType, embedding, pineconeQueryResult, answer } =
    res.locals;
};

export const getProfile: RequestHandler = async (req, res) => {
  try {
    const profile = await Logs.find(); // ! what to filter????
    res.json(profile);
  } catch (err: any) {
    console.error('❌ Error fetching profle:', err.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
