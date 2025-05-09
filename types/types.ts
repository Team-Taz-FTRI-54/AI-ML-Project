import { Request } from 'express';

export type ServerError = {
  log: string;
  status: number;
  message: { err: string };
};

export interface FileRequest extends Request {
  file?: Express.Multer.File;
}
