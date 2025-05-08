import { RequestHandler } from 'express';
import { ServerError } from '../../types/types';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { SYSTEM_PROMPTS } from '../prompts';
import { buildUserPrompt } from '../prompts';

dotenv.config();
//console.log('OPENAIAPIKEY', `${process.env.OPENAI_API_KEY}`);
const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

export const queryOpenAIEmbedding: RequestHandler = async (_req, res, next) => {
  const { userQuery } = res.locals;
  if (!userQuery) {
    const error: ServerError = {
      log: 'queryOpenAIEmbedding did not receive a user query',
      status: 500,
      message: { err: 'An error occurred before querying OpenAI' },
    };
    return next(error);
  }
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: userQuery,
    });

    res.locals.embedding = response.data[0].embedding;
    // console.log('embedding response:', response);
    // console.log('res.locals.embedding :', response.data[0].embedding);
    return next();
  } catch (_err) {
    return next({
      log: 'queryOpenAI: Error: OpenAI error',
      status: 500,
      message: { err: 'An error occurred while querying OpenAI' },
    });
  }
};

export const queryOpenAIChat: RequestHandler = async (_req, res, next) => {
  const { userQuery, pineconeQueryResult, style } = res.locals; // added style for prompts which is passed from front ent
  if (!userQuery) {
    const error: ServerError = {
      log: 'queryOpenAIChat did not receive a user query',
      status: 500,
      message: { err: 'An error occurred before querying OpenAI' },
    };
    return next(error);
  }
  if (!pineconeQueryResult) {
    const error: ServerError = {
      log: 'queryOpenAIChat did not receive pinecone query results',
      status: 500,
      message: { err: 'An error occurred before querying OpenAI' },
    };
    return next(error);
  }

  // manipulate pineconeQueryResult and etract meta data only
  const data = pineconeQueryResult
    .map((el) => el.metadata)
    .filter((metadata) => metadata !== undefined);

  //!define user / system prompts
const systemPromptContent = SYSTEM_PROMPTS[style];
const userPromptContent = buildUserPrompt(style, data, userQuery);

  const userInput: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
    role: 'user',
    content: userPromptContent,
  };
  const systemInput: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
    role: 'system',
    content: systemPromptContent,
  };

  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [userInput, systemInput],
    });

    res.locals.answer = result.choices[0].message.content as string;

    return next();
  } catch (err) {
    console.error('Error querying OpenAI:', err);
    return next({
      log: 'queryOpenAIChat: Error querying OpenAI',
      status: 500,
      message: { err: 'An error occurred while querying OpenAI' },
    });
  }
};
