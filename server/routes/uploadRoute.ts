import express from 'express';
import { fileUpload } from '../controllers/uploadController.js';
import { processPdfEmbeddings } from '../controllers/embeddingsController.js';
import { documentStore, generateSessionId } from '../store/documentStore.js';

const router = express.Router();

router.post(
  '/upload',
  fileUpload.single('file'),
  processPdfEmbeddings,
  (_req, res) => {
    const sessionId = generateSessionId();

    documentStore.set(sessionId, {
      vectorResults: res.locals.vectorResults,
      documentId: res.locals.vectorResults[0]?.metadata.document_id,
      timestamp: new Date().toISOString,
    });

    res.status(200).json({
      success: true,
      message: `SessionID: ${sessionId} created. Document processed successfully ✅.`,
      sessionId: sessionId,
    });
  }
);

export default router;
