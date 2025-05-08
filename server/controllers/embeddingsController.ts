import { Request, RequestHandler } from 'express';
import { fileURLToPath, pathToFileURL } from 'url';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { chunkit } from 'semantic-chunking';
import { parsePdf } from '../utils/pdfUtils.js';
// import { ServerError } from '../../types/types';

/**
 * 1/ Extract the text from the PDF ✅
 * 2/ Break the text down into chunks
 * 3/ Generate embeddings, vectorize the chunks
 * 4/ Upsert the chunk + embedding together
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pdfFilePath = path.join(__dirname, '../documents/RAG.pdf');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Check if file exists before trying to read it
if (!fs.existsSync(pdfFilePath)) {
  console.error(`PDF file not found at: ${pdfFilePath}`);
  process.exit(1);
}

// const pdfExtract = new PDFExtract();
// const options: PDFExtractOptions = {};
// pdfExtract
//   .extract(pdfFilePath, options)
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));

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
    document_id: string;
    number_of_chunks: number;
    token_length: number;
    timestamp: string;
  };
}

// interface EmbeddedChunk {
//   movie: string;
//   embedding: OpenAI.Embedding['embedding'];
// }

const main = async () => {
  try {
    const testPdf = fs.readFileSync(pdfFilePath);
    console.log('PDF file loaded');

    // 1. Extract text from the PDF
    // https://www.npmjs.com/package/pdf-parse
    const data = await parsePdf(testPdf); // parse-pdf
    console.log('\nPDF parsing successful ✅\n');
    const pdfTitle = data.info.Title;
    console.log(data.numpages); // number of pages
    console.log(data.numrender); // number of rendered pages
    console.log(data.metadata); // PDF metadata -> This is empty right now, we have to add some MetaData
    // console.log(data.info); // PDF info
    // console.log(data.version); // PDF.js version
    // console.log(data.text); // PDF text

    // 2. Break the text down into chunks
    // <------ Option 1: Fixed size chunking ------>
    const textData: string = data.text;
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
    console.log('Starting semantic chunking...');
    // Create documents for semantic-chunking
    const documents = [
      { document_name: 'parsed-data', document_text: textData },
    ];

    // Generate chunks
    const chunksLib = await chunkit(documents, {
      maxTokenSize: 600,
      overlap: 0.15, // 15% overlap between chunks (can be true/false or a number)
      keepSections: true, // Maintains section coherence if possible
      similarityThreshold: 0.5,
    });
    console.log('### Option 2: Semantic-Chunking ###');
    console.log(`Created ${chunksLib.length} semantic chunks`);

    // 3. Create objects for each chunk including ID, text, metadata
    // Map through this chunksLib
    // create from each chunk an object with ID, the text (chunk text), metadata
    // metada - page, chunk number, date,...
    // unique String id for the user

    const arrayOfChunks = chunksLib.map((el: Chunk, i: number) => ({
      ID: `chunk-${i}`,
      text: el.text,
      metadata: {
        source: pdfTitle,
        chunkIndex: i,
        document_id: el.document_id,
        number_of_chunks: el.number_of_chunks,
        token_length: el.token_length,
        timestamp: new Date().toISOString(),
        // Todo: grab a page
      },
    }));

    console.log(`### chunksObject ###`);
    console.log(arrayOfChunks);

    // 4. Generate embeddings
    // map through chunksObject
    // on each grab the chunksObject.text
    // call openai api embeddings model on chunksObject.text
    // create a new object with all previous properties (ID, text, metadata) and add embeddings to it

    try {
      // const embedding = await client.embeddings.create({
      //   model: 'text-embedding-3-small',
      //   input: chunksObject.text,
      //   encoding_format: 'float',
      // });
      // const embeddings = embedding.data[0].embedding;

      // // https://stackoverflow.com/questions/46854299/react-calling-a-function-inside-a-map-function/46854363
      // chunksObject.map(async function () {
      //   const embedding = await client.embeddings.create({
      //     model: 'text-embedding-3-small',
      //     input: chunksObject.text,
      //     encoding_format: 'float',
      //   });
      //   const embeddings = embedding.data[0].embedding;
      // });
      let batchEmbedding: Array<Array<ChunkObject>> = [];
      let chunkSize = 20;
      let startIndex = 0;
      if (arrayOfChunks.length > 20) {
        // slice the chunksObject
        while (startIndex < arrayOfChunks.length) {
          const chunk = arrayOfChunks.slice(startIndex, startIndex + chunkSize);
          batchEmbedding.push(chunk);
          startIndex += chunkSize;
        }
      } else {
        batchEmbedding = [arrayOfChunks];
      }

      for (const batch of batchEmbedding) {
        const embeddingsResults = await Promise.all(
          batch.map(async (chunk) => {
            console.log(`### CHUNK ${batchEmbedding.indexOf(batch)} ###`);
            // console.log(chunk.text);
          })
        );

        // create 1 sec buffer to avoid api rate limits (for bigger api calls)
        if (batchEmbedding.indexOf(batch) < batchEmbedding.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (err) {}

    // 5. Upsert the data
    // 6. Store the data inside the MongoDB
  } catch (err) {
    console.error(`Error processing PDF: ${err}`);
  }
};

main();
