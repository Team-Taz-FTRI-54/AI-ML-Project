export type ServerError = {
  log: string;
  status: number;
  message: { err: string };
};

export type Metadata = {
  source: string;
  chunkIndex: number;
  chunkID: string;

  document_id: string;
  number_of_chunks: number;
  token_length: number;
  timestamp: string;
};
