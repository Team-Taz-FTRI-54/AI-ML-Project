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
  pineconeQueryResult: { type: String, required: true },
  answer: { type: String, required: true },
});

// Create model
const Logs = mongoose.model<LogDocument>('logs', logSchema);

export default Logs;
