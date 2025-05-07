import { Request, RequestHandler } from 'express';
import { fileURLToPath, pathToFileURL } from 'url';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import pdf from 'pdf-parse';
// import { ServerError } from '../../types/types';

/**
 * 1/ Extract the text from the PDF
 * 2/ Break the text down into chunks
 * 3/ Generate embeddings, vectorize the chunks
 * 4/ Upsert the chunk + embedding together
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testPdf = fs.readFileSync(
  path.join(__dirname, '../documents/RAG.pdf'),
  'utf8'
);

// 1. Extract text from the PDF
console.log(testPdf);
pdf(testPdf)
  .then(function (data: any) {
    // number of pages
    console.log(data.numpages);

    // number of rendered pages
    console.log(data.numrender);

    // PDF info
    console.log(data.info);

    // PDF metadata
    console.log(data.metadata);

    // PDF.js version
    // check https://mozilla.github.io/pdf.js/getting_started/
    console.log(data.version);

    // PDF text
    console.log(data.text);
  })
  .catch(function (error: unknown) {
    console.error(`Error while parsing through a PDF: ${error}`);
  });

// 2. Break the text down into chunks
