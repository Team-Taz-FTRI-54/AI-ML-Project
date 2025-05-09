import { RequestHandler } from 'express';
import { ServerError } from '../../types/types.js';
import { Pinecone } from '@pinecone-database/pinecone';
import { constrainedMemory } from 'process';
import { ScoredPineconeRecord } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: `${process.env.PINECONE_API_KEY}`,
});
const index = pc.index('ask-your-pdf'); // ! pending for db name

export const queryPineconeDatabase: RequestHandler = async (
  _req,
  res,
  next
) => {
  const { embedding } = res.locals;
  if (!embedding) {
    const error: ServerError = {
      log: 'Database query middleware did not receive embedding',
      status: 500,
      message: { err: 'An error occurred before querying the database' },
    };
    return next(error);
  }
  const vectorResults = res.locals.vectorResults;
  console.log(vectorResults);
  console.log(vectorResults[0]);
  try {
    const queryResponse = await index.namespace('').query({
      vector: embedding,
      topK: 3,
      includeValues: false,
      includeMetadata: true,
      // filter,
      filter: {
        document_id: vectorResults[0].metadata.document_id, // ! 👈 Place holder!!! Adjust this with the one that passed from frontend
      },
    });

    if (!queryResponse.matches) {
      return next({
        log: 'queryPinconeDatabase: No Matches found in Pinecone query response',
        status: 500,
        message: { err: 'No matches found in Pinecone query response ' },
      });
    }

    console.log('Pine Cone query result matches:', queryResponse.matches);

    res.locals.pineconeQueryResult = queryResponse.matches;

    return next();
  } catch (_err) {
    console.error('Pinecone query error:', _err);
    return next({
      log: 'queryPineconeDatabase: Error: Pinecone error',
      status: 500,
      message: { err: 'An error occurred while querying Pinecone Database' },
    });
  }
};
