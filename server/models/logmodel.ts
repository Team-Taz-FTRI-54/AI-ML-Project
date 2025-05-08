import mongoose, { Schema, Document } from 'mongoose';

// Define type
type logType = {
  promptText: string;
  promptType: string;
  embedding: string;
  pineconeQueryResult: string;
  answer: string;
};

// Extend Document to get Mongoose Document methods and metadata
type LogDocument = logType & Document;

// Define schema
const logSchema = new Schema<LogDocument>({
  promptText: { type: String, required: true },
  promptType: { type: String, required: true },
  embedding: { type: String, required: true },
  pineconeQueryResult: [
    {
      ID: { type: String, required: true },
      text: { type: String, required: true },
      metadata: {
        source: { type: String, required: true },
        chunkIndex: { type: Number, required: true },
        document_id: { type: String, required: true },
        number_of_chunks: { type: Number, required: true },
        token_length: { type: Number, required: true },
        timestamp: { type: String, required: true },
      },
    },
  ],
  answer: { type: String, required: true },
});

// Create model
const Logs = mongoose.model<LogDocument>('logs', logSchema);

export default Logs;
