import { Request, RequestHandler } from 'express';
import { ServerError } from '../../types/types.js';

export const parseUserQuery: RequestHandler = async (
  req: Request<unknown, unknown, Record<string, unknown>>,
  res,
  next
) => {
  if (!req.body.userQuery) {
    const error: ServerError = {
      log: 'User query not provided',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    };
    return next(error);
  }

  const { userQuery } = req.body; //! may need to add more states passed from frontend

  if (typeof userQuery !== 'string') {
    const error: ServerError = {
      log: 'User query is not a string',
      status: 400,
      message: { err: 'An error occurred while parsing the user query' },
    };
    return next(error);
  }

  res.locals.userQuery = userQuery;

  return next();
};
