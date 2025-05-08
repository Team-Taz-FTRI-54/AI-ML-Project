import { RequestHandler } from 'express';
import { ServerError } from '../../types/types.js';
import Logs from '../models/logModel.js';

export const logQuery: RequestHandler = async (req, res, next) => {
  const { prompt, type, embedding, pineconeQueryResult, answer } = res.locals;

  try {
    await Logs.insertOne({
      prompt,
      type,
      embedding,
      pineconeQueryResult,
      answer,
    });
    console.log('👌 Logged success!');
    return next();
  } catch (err: any) {
    console.error('❌ Error saving log:', err.message);
    res.status(500).json({ error: 'Failed to log' });
  }
};

export const getProfile: RequestHandler = async (req, res) => {
  try {
    const profile = await Logs.find({}, 'prompt'); // ! what to filter????
    res.json(profile);
  } catch (err: any) {
    console.error('❌ Error fetching profle:', err.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
