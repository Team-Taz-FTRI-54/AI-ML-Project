import mongoose, { Schema, Document } from 'mongoose';

// Define type

type PineconeMetadata = {
  source: string;
  chunkIndex: number;
  chunkID: string;
  document_id: string;
  number_of_chunks: number;
  token_length: number;
  timestamp: string;
  text: string;
};

type PineconeMatch = {
  id: string;
  values: number[];
  metadata: PineconeMetadata;
};

type logType = {
  prompt: string;
  type: string;
  embedding: number[];
  pineconeQueryResult: PineconeMatch[];
  answer: string;
};
// Extend Document to get Mongoose Document methods and metadata
type LogDocument = logType & Document;

// Define schema
const logSchema = new Schema<LogDocument>({
  prompt: { type: String, required: true },
  type: { type: String, required: true },
  embedding: { type: [Number], required: true },
  pineconeQueryResult: [
    {
      id: { type: String, required: true },
      values: { type: [Number], required: true },

      metadata: {
        source: { type: String, required: true },
        chunkIndex: { type: Number, required: true },
        chunkID: { type: String, required: true },
        document_id: { type: String, required: true },
        number_of_chunks: { type: Number, required: true },
        token_length: { type: Number, required: true },
        timestamp: { type: String, required: true },
        text: { type: String, required: true },
      },
    },
  ],
  answer: { type: String, required: true },
});

// Create model
const Logs = mongoose.model<LogDocument>('logs', logSchema);

export default Logs;
