import express from 'express';
const router = express.Router();

import { parseFile } from '../controllers/uploadController.js';

router.post(
  '/api/upload',
  parseFile
  (_req, res) => {
    res.status(200).json({ amswer: res.locals.answer });
  }
);

export default router;
