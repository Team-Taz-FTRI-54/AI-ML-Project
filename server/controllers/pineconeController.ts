import { RequestHandler } from 'express';
import { ServerError } from '../../types/types.js';
import { Pinecone } from '@pinecone-database/pinecone';
import { documentStore, generateSessionId } from '../store/documentStore.js';
import { constrainedMemory } from 'process';
import { ScoredPineconeRecord } from '@pinecone-database/pinecone';

import dotenv from 'dotenv';
dotenv.config();
const pc = new Pinecone({
  apiKey: `${process.env.PINECONE_API_KEY}`,
});
const index = pc.index('ask-your-pdf'); // ! pending for db name
console.log(process.env.PINECONE_API_KEY);

export const queryPineconeDatabase: RequestHandler = async (req, res, next) => {
  const { embedding } = res.locals;
  const { sessionId } = req.body;

  if (!embedding) {
    const error: ServerError = {
      log: 'Database query middleware did not receive embedding',
      status: 500,
      message: { err: 'An error occurred before querying the database' },
    };
    return next(error);
  }
  const documentStore = new Map<string, any>();

  const documentData = documentStore.get(sessionId);
  // console.log('SessionID received:', sessionId);
  // console.log('DocumentId:', documentData.documentId);
  //console.log('Document data retrieved:', sessionId);

  try {
    const queryResponse = await index.query({
      vector: embedding,
      topK: 3,
      includeValues: false,
      includeMetadata: true,
      // filter,
      // filter: {
      //   document_id: { $eq: documentData.documentId },
      // },
    });

    if (!queryResponse.matches) {
      return next({
        log: 'queryPinconeDatabase: No Matches found in Pinecone query response',
        status: 500,
        message: { err: 'No matches found in Pinecone query response ' },
      });
    }

    // console.log('Pine Cone query result matches:', queryResponse.matches);

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
