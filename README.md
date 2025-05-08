https://github.com/Team-Taz-FTRI-54/AI-ML-Projec
https://www.npmjs.com/package/pdf-parse
https://www.mongodb.com/docs/manual/core/gridfs/

### MVP

- Store the PDF somewhere / Store it inside MongoDB
  -> For MVP - store the text only
  --> Store the vectorized version in the PDF
  -> Store the PDF / Store the text (MongoDB - GridFS)
  --> Amazon S3 bucket for simple file storage / GridFS
  --> Allow the user to ask about a particular section of the PDF
  --> Point the user where you asked this information (page)
- PDF parsing (Paralelism)
- Then accept user's query
- Separate query parsing into two steps (take the user's query)
- Send that to the OpenAI API, ask the model to parse the user's questions / format it in a particular way that's going to be easier to compare against the vector's stored PineCone DB.
- How much that affects the performance of the application
- Pre-defining prompts:
  (a) What would happen if?
  (b) Teach me something new about?
  (c) Open Query

### How to start?

- Think about all the steps that will be needed to implement this
- Any PDF -> split the PDF into chunks
- How to store this in Pinecone -> what Metadata (Cascade filtering)
- First filter the DB only those vectors that were upload by this user from this particular PDF
- Unique string

### To-do list:

1/ Extract text from the pdf
2/ Chunk down the text
3/ Text extracvtion -> Chunk -> Embedding
4/ Retrieval + RAG: Query -> Embedded query -> Fetch top K vectors -> LLM prompt
5/

### Step-by-step

0/ How to implement cascading using a unique string per user to retrieve only that specific data?

1/ Extract the text => Parse through the PDF and extract all text that's relevant

- pdf-parse for text, Optical Character Recognition (OCR) for image based PDFs
- What type of PDFs are we uploading:
  \_ text, images, tables,...
- Text normalization / Preprocessing is a vital step before chunking and embedding.
  \_ remove whitespace (pdf-parse)
  \_ remove unnecessary text (footer, header) - whatever else will pollute the embedding
  \_ turn everything into a lowercase

- capture metadata - chapter heading, page number (Pinecone metadata)
- embed pages one by one, not the whole doc

2/ Chunk down the text

- How much to chunk the text down?
  \_ page / sentence (nltk) / paragraph / semantic chunking
  \_ group sentences together
  \_ look up libraries
- Implement overlapping chunks (e.g. chunk size = 300 tokens, the overlap is 30-45 tokens)

3/ Embed (Figure out what amount of context to embed?)

- Batch process the API calls -> Check OpenAI API documentation
  \_ https://platform.openai.com/docs/guides/batch
  \_ https://medium.com/@mikehpg/tutorial-batch-embedding-with-openai-api-95da95c9778a

Store the text (locally / database (???) - depends on the size)

- Where to store the files?
- Should we calculate the number of words? / Number of tokens and decide based on the number of tokens?

### Technical challenges:


- What type of PDF parser to use? (images / text / tables (research paper))
- How much to chunk the text down? (narrative books vs. research papers)
- Generate embeddings for the chunks in batches using OpenAI API Batch

- Is it a summary of each chapter?
- What's the best way of embedding an entire PDF text content? The PDF could be from 5 pages to 300 pages.

## Eric S Responsibilities

1/ Frontend set-up on components
2/ UI/UX for application
3/ Assist in mongodb set-up
