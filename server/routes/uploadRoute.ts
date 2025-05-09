import express from 'express';
import { fileUpload } from '../controllers/uploadController.js';
import { processPdfEmbeddings } from '../controllers/embeddingsController.js';

const router = express.Router();

router.post(
  '/upload',
  fileUpload.single('file'),
  processPdfEmbeddings,
  (_req, res) => {
    res.status(200).json(res.locals.vectorResults);
  }
);

export default router;
