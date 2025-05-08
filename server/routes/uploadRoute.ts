import express from 'express';
const router = express.Router();

import { processPdfEmbeddings } from '../controllers/embeddingsController.js';

router.post('/api/upload', processPdfEmbeddings, (_req, res) => {
  res.status(200).json();
});

export default router;
