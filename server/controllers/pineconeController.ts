import { RequestHandler } from 'express';
import { ServerError } from '../../types/types';
import { Pinecone } from '@pinecone-database/pinecone';
import { constrainedMemory } from 'process';
import { ScoredPineconeRecord } from '@pinecone-database/pinecone';

const pc = new Pinecone({
  apiKey: `${process.env.P_API_KEY}`,
});
const index = pc.index(''); // ! pending for db name

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

  // const filter: Record<string, object> = {};
  // if (startYear && endYear) {
  //   filter.year = { $gte: Number(startYear), $lte: Number(endYear) };
  // }

  try {
    const queryResponse = await index.namespace('').query({
      //! need to filter by ref id here
      vector: embedding,
      topK: 3,
      includeValues: false,
      includeMetadata: true,
      // filter,
    });

    if (!queryResponse.matches) {
      return next({
        log: 'queryPinconeDatabase: No Matches found in Pinecone query response',
        status: 500,
        message: { err: 'No matches found in Pinecone query response ' },
      });
    }

    console.log(queryResponse.matches);
    //   const result = queryResponse.matches.map((el)=>el.metadata).filter((metadata): metadata is MovieMetadata => metadata !== undefined);;
    //  res.locals.pineconeQueryResult = result

    res.locals.pineconeQueryResult = queryResponse.matches;

    return next();
  } catch (_err) {
    return next({
      log: 'queryPineconeDatabase: Error: Pinecone error',
      status: 500,
      message: { err: 'An error occurred while querying Pinecone Database' },
    });
  }
};
