import { RequestHandler } from 'express';
import { ServerError } from '../../types/types.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { SYSTEM_PROMPTS } from '../prompts.js';
import { buildUserPrompt } from '../prompts.js';
import { Metadata } from 'openai/resources.mjs';

dotenv.config();
//console.log('OPENAIAPIKEY', `${process.env.OPENAI_API_KEY}`);
const openai = new OpenAI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

export const queryOpenAIEmbedding: RequestHandler = async (_req, res, next) => {
  const { prompt } = res.locals;
  if (!prompt) {
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
      input: prompt,
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
  const { userQuery, pineconeQueryResult, style } = res.locals as {
    userQuery: string;
    pineconeQueryResult: any;
    style: keyof typeof SYSTEM_PROMPTS;
  }; // added style for prompts which is passed from front end
  if (!userQuery) {
    const { prompt, pineconeQueryResult, type } = res.locals; // added style for prompts which is passed from front ent
    if (!prompt) {
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

    interface PineconeQueryResult {
      metadata: {
        source: string;
        chunkIndex: number;
        chunkID: string;
        document_id: string;
        number_of_chunks: number;
        token_length: number;
        timestamp: string;
        text: string;
      };
    }

    const data = pineconeQueryResult
      .map(
        (el: PineconeQueryResult, i: number) => ` Option ${i}:${el.metadata} `
      )
      .filter((metadata: Metadata) => metadata !== undefined);

    //!define user / system prompts
    if (!(style in SYSTEM_PROMPTS)) {
      return next({
        log: `queryOpenAIChat: Invalid style '${style}' provided`,
        status: 400,
        message: { err: 'Invalid style provided for querying OpenAI' },
      });
    }
    const systemPromptData = SYSTEM_PROMPTS[style];
    const userPromptData = buildUserPrompt(style, data, userQuery);

    const userInput: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
      role: 'user',
      content: userPromptData,
    };
    const systemInput: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
      role: 'system',
      content: systemPromptData.content,
    };

    try {
      const result = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [userInput, systemInput],
        temperature: systemPromptData.temperature,
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
  }
};
