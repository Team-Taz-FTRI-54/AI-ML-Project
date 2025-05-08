import express from 'express';
const router = express.Router();

import { main } from '../controllers/embeddingsController.js';

router.post('/api/upload', main, (_req, res) => {
  res.status(200).json();
});

export default router;
