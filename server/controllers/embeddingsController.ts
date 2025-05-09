import { Request, RequestHandler } from 'express';
import { fileURLToPath, pathToFileURL } from 'url';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { chunkit } from 'semantic-chunking';
import { parsePdf } from '../utils/pdfUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pdfFilePath = path.join(__dirname, '../documents/RAG.pdf');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
const index = pinecone.index('ask-your-pdf');

interface Chunk {
  document_id: number;
  document_name: string;
  number_of_chunks: number;
  chunk_number: number;
  model_name: string;
  dtype: string;
  text: string;
  token_length: number;
}

interface ChunkObject {
  ID: string;
  text: string;
  metadata: {
    source: string;
    chunkIndex: number;
    chunkID: string;
    document_id: number;
    number_of_chunks: number;
    token_length: number;
    timestamp: string;
  };
}

interface VectorResult {
  ID: string;
  text: string;
  metadata: {
    source: string;
    chunkIndex: number;
    document_id: number;
    chunkID: string;
    number_of_chunks: number;
    token_length: number;
    timestamp: string;
  };
  embeddings?: number[];
}

async function processPdf(filePath: string) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found at: ${filePath}`);
    }

    const testPdf = fs.readFileSync(pdfFilePath);
    console.log('PDF file loaded');

    const data = await parsePdf(testPdf);
    console.log('\nPDF parsing successful ✅\n');

    // Extract key metadata
    const pdfTitle = data.info?.Title || 'Untitled';
    console.log(`Pages: ${data.numpages}`);
    console.log(`Rendered pages: ${data.numrender}`);
    console.log('PDF metadata:', data.metadata);

    return {
      text: data.text,
      title: pdfTitle,
      pageCount: data.numpages,
      renderCount: data.numrender,
      metadata: data.metadata,
      info: data.info,
    };
  } catch (err) {
    console.error('Error processing PDF:', err);
    throw err;
  }
}

async function generateArrayOfChunks(
  textData: string,
  pdfTitle: string
): Promise<ChunkObject[]> {
  console.log('Starting semantic chunking...');
  // Create documents for semantic-chunking
  const documents = [{ document_name: 'parsed-data', document_text: textData }];

  // Generate chunks
  const chunksLib = await chunkit(documents, {
    maxTokenSize: 600,
    overlap: 0.15, // 15% overlap between chunks (can be true/false or a number)
    keepSections: true, // Maintains section coherence if possible
    similarityThreshold: 0.5,
  });
  console.log('### Option 2: Semantic-Chunking ###');
  console.log(`Created ${chunksLib.length} semantic chunks`);

  // <------ 3. Create objects for each chunk including ID, text, metadata ------>
  // Map through this chunksLib
  // create from each chunk an object with ID, the text (chunk text), metadata
  // metada - page, chunk number, date,...
  // unique String id for the user

  return chunksLib.map((el: Chunk, i: number) => ({
    ID: `chunk-${i}-${el.document_id}`,
    text: el.text,
    metadata: {
      source: pdfTitle,
      chunkIndex: i,
      chunkID: `chunk-${i}`,
      document_id: el.document_id,
      number_of_chunks: el.number_of_chunks,
      token_length: el.token_length,
      timestamp: new Date().toISOString(),
    },
  }));
}

async function generateVectorResults(
  arrayOfChunks: ChunkObject[]
): Promise<VectorResult[]> {
  const batchSize = 20;
  let vectorResults: VectorResult[] = [];
  for (let i = 0; i < arrayOfChunks.length; i += batchSize) {
    const currentBatch = arrayOfChunks.slice(i, i + batchSize);
    const results = await Promise.all(
      // Map through each chunk (el = chunk)
      currentBatch.map(async (el: ChunkObject) => {
        // Generate embeddings for each chunk
        const embedding = await client.embeddings.create({
          model: 'text-embedding-3-small',
          input: el.text,
          encoding_format: 'float',
        });

        // Return everything inside the chunk + generate property embeddings
        return {
          ...el,
          embeddings: embedding.data[0].embedding,
        };
      })
    );
    // Push the entire arrayOfChunks to our new array
    vectorResults.push(...results);

    // Avoid API rate limits
    if (i + batchSize < arrayOfChunks.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  return vectorResults;
}

const upsertBatchesToPicone = async (vectors: Array<any>): Promise<void> => {
  // Create batches of vectors
  const batchSize = 20;
  const batches = [];
  for (let i = 0; i < vectors.length; i += batchSize) {
    batches.push(vectors.slice(i, i + batchSize));
  }

  const upsertResults = await Promise.allSettled(
    batches.map(async (batch, i) => {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const pineconeVectors = batch.map((vector) => ({
        id: vector.ID,
        values: vector.embeddings, // embeddings
        metadata: {
          ...vector.metadata, // document_id
          text: vector.text,
        },
      }));
      console.log(`Upserting batch ${i + 1} of ${batches.length}`);
      console.log(pineconeVectors);
      return index.upsert(pineconeVectors);
    })
  );

  console.log('### upsertResults ###');
  console.log(upsertResults);
};

export const processPdfEmbeddings: RequestHandler = async (req, res, next) => {
  try {
    // // Get PDF file from request
    // const pdfFile = req.file;
    // if (!pdfFile) {
    //   return res.status(400).json({ error: 'No PDF file provided' });
    // }

    // <------ 1. Extract text from the PDF ------>
    // https://www.npmjs.com/package/pdf-parse
    const pdfData = await processPdf(pdfFilePath);
    const pdfTitle = pdfData.title;
    const textData: string = pdfData.text;

    // <------ 2. Break the text down into chunks ------>
    // Option 1: Fixed size chunking
    // const chunkSize: number = 600;
    // const overlap: number = chunkSize * 0.15; // 15% overlap
    // let curIndex: number = 0;
    // let chunks = [];

    // // loop through the text - while startIndex < textData
    // while (curIndex < textData.length) {
    //   // grab the next 300 chunks by slicing the textData(curIndex, curIndex + chunk)
    //   let chunk = textData.slice(curIndex, curIndex + chunkSize);

    //   // grab the beginning of the last sentence ". ? ! \n"
    //   if (curIndex + chunkSize < textData.length) {
    //     const lastSentence = Math.max(
    //       chunk.indexOf('.'),
    //       chunk.indexOf('!'),
    //       chunk.indexOf('?'),
    //       chunk.indexOf('\n')
    //     );

    //     if (lastSentence < chunkSize * 0.3) {
    //       chunk = chunk.slice(0, lastSentence + 1);
    //     }
    //   }
    //   chunks.push(chunk);
    //   curIndex += chunkSize - overlap; // We're keeping a 15% overlap
    // }
    // console.log('### Option 1: Fixed size chunking ###');
    // console.log(`Created ${chunks.length} semantic chunks`);

    // <------ Option 2: Use an existing library ------>
    // // https://www.datastax.com/blog/how-to-chunk-text-in-javascript-for-rag-applications
    // Semantic-chunking https://www.npmjs.com/package/semantic-chunking
    // Additional resource #1: https://github.com/FullStackRetrieval-com/RetrievalTutorials/blob/main/tutorials/LevelsOfTextSplitting/5_Levels_Of_Text_Splitting.ipynb
    // Additional resource #2: https://hasanaboulhasan.medium.com/the-best-text-chunking-method-f5faeb243d80
    const arrayOfChunks: ChunkObject[] = await generateArrayOfChunks(
      textData,
      pdfTitle
    );
    console.log(`### chunksObject ###`);
    console.log(arrayOfChunks);

    // <----------------- SWITCHING THE APPROACH, LATER FOR MULTIPLE FILES PROCESSING ----------------->
    // // <------ 4. Generate embeddings ------>
    //   // // https://stackoverflow.com/questions/46854299/react-calling-a-function-inside-a-map-function/46854363
    //   let batchEmbedding: Array<ChunkObject> = [];
    //   let chunkSize = 20;
    //   let startIndex = 0;
    //   if (arrayOfChunks.length > 20) {
    //     // slice the chunksObject
    //     while (startIndex < arrayOfChunks.length) {
    //       const chunk = arrayOfChunks.slice(startIndex, startIndex + chunkSize);
    //       batchEmbedding.push(chunk);
    //       startIndex += chunkSize;
    //     }
    //   } else {
    //     batchEmbedding = arrayOfChunks;
    //   }
    //   console.log('### batchEmbedding ###');
    //   // console.log(batchEmbedding);
    //   // console.log(JSON.stringify(batchEmbedding));
    //   const document_id = batchEmbedding[0].metadata.document_id;

    // // <------ 4.1 Create JSON file for Batch processing ------>
    // // Documentation: https://platform.openai.com/docs/guides/batch
    // // https://stackoverflow.com/questions/74907244/how-can-i-use-batch-embeddings-using-openais-api
    // const batchForJSONL = batchEmbedding.map((el, i) => ({
    //   custom_id: el.ID, // unique parameter being the
    //   method: 'POST',
    //   url: '/v1/embeddings',
    //   body: {
    //     model: 'text-embedding-3-small',
    //     input: el.text, // we want to embed the text content
    //     encoding_format: 'float',
    //   },
    // }));
    // // Create a JSONL file for OpenAI Batch API processing
    // const fileName = `batchEmbedding-${document_id}.jsonl`;
    // const jsonlContent = batchForJSONL
    //   .map((item) => JSON.stringify(item))
    //   .join('\n');
    // fs.writeFileSync(fileName, jsonlContent);

    // // <------ 4.2 Batch processing OpenAI ------>
    // // 4.2.1 Upload batch file OpenAI
    // const file = await client.files.create({
    //   file: fs.createReadStream(fileName),
    //   purpose: 'batch',
    // });
    // console.log(file);
    // // 4.2.2 Create the batch
    // const batch = await client.batches.create({
    //   input_file_id: file.id,
    //   endpoint: '/v1/embeddings',
    //   completion_window: '24h',
    // });
    // console.log(batch);
    // const batchRetrieve = await client.batches.retrieve(batch.id);
    // console.log(batchRetrieve);

    // <------ 4.1 Standard Embedding API Call ------>
    const vectorResults: VectorResult[] = await generateVectorResults(
      arrayOfChunks
    );
    console.log(`### VECTOR EMBEDDINGS ###`);
    console.log(`Created ${vectorResults.length} embeddings`);
    // console.log(vectorResults);

    // <------ 5. Upsert the Data to the Pinecone DB ------>
    upsertBatchesToPicone(vectorResults);

    // <------ 6. Store vectorResults in request for downstream middleware ------>
    res.locals.vectorMetadata = vectorResults;
    console.log(vectorResults);
    // (Optional) 7. Store the data inside the MongoDB

    next();
  } catch (err) {
    console.error('Error while trying to embed vectors: ', err);
  }
};
