# 🧠 Turning Voro-Bot into an AI Assistant (RAG Guide)

This guide explains how to upgrade **Voro-Bot** from a simple keyword-matching bot to an intelligent AI assistant that "understands" questions, similar to ChatGPT, but answers **strictly** using your own data. This technique is called **RAG (Retrieval-Augmented Generation)**.

---

## 🛠️ The Tech Stack

We will stick to **Node.js** so you don't have to learn a new language.

1.  **LangChain.js**: The framework that connects your data to the AI.
2.  **Google Gemini API** (or OpenAI): The "brain" that generates the English sentences.
3.  **MemoryVectorStore** (or ChromaDB): A temporary database that stores your data in a format the AI can search (called "embeddings").

---

## 📝 Step 1: Preparation

### 1. Get an API Key

You need a "brain" for your bot.

- **Recommended**: [Google AI Studio](https://aistudio.google.com/) (Get a Gemini API Key). It's fast and has a free tier.
- **Alternative**: OpenAI API (Requires a credit card).

### 2. Install New Libraries

In your `voro-bot/backend` folder, run this command to install the necessary tools:

```bash
npm install @langchain/google-genai langchain @langchain/core dotenv
```

---

## ⚙️ Step 2: The Code (How to Build It)

Create a new file in your `backend` folder called `ai-bot.js`. This script will handle the "thinking".

### `backend/ai-bot.js`

```javascript
require("dotenv").config();
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { TaskType } = require("@google/generative-ai");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { Document } = require("@langchain/core/documents");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const {
  createStuffDocumentsChain,
} = require("langchain/chains/combine_documents");
const { createRetrievalChain } = require("langchain/chains/retrieval");
const sqlite3 = require("sqlite3").verbose();

// 1. Setup the AI Model
const model = new ChatGoogleGenerativeAI({
  modelName: "gemini-1.5-flash",
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY,
});

// 2. Load Data from Your Database
const db = new sqlite3.Database("./college_data.db");

async function loadDataAndCreateVectorStore() {
  return new Promise((resolve, reject) => {
    // We get ALL your Q&A data to "teach" the bot
    db.all("SELECT title, answer FROM options", [], async (err, rows) => {
      if (err) return reject(err);

      // Convert DB rows into "Documents" for LangChain
      const docs = rows.map(
        (row) =>
          new Document({
            pageContent: `Question: ${row.title}\nAnswer: ${row.answer}`,
            metadata: { source: "college_db" },
          })
      );

      // Create the Vector Store (The AI's searchable memory)
      const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        taskType: TaskType.RETRIEVAL_DOCUMENT,
      });

      const vectorStore = await MemoryVectorStore.fromDocuments(
        docs,
        embeddings
      );
      resolve(vectorStore);
    });
  });
}

// 3. The Main Function to Ask Questions
async function askBot(userQuestion) {
  console.log("Initializing AI...");
  const vectorStore = await loadDataAndCreateVectorStore();

  // Create a "Retriever" (It finds the relevant info)
  const retriever = vectorStore.asRetriever({ k: 2 }); // Find top 2 closest matches

  // Create the Prompt (Instructions for the AI)
  const prompt = ChatPromptTemplate.fromTemplate(`
    You are a helpful college assistant for Dr. Antonio Da Silva Technical High School.
    Answer the user's question based ONLY on the following context. 
    If the answer is not in the context, say "I'm sorry, I don't have that information yet."
    
    Context:
    {context}
    
    Question: {input}
  `);

  // Combine everything into a Chain
  const combineDocsChain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  });

  const retrievalChain = await createRetrievalChain({
    combineDocsChain,
    retriever,
  });

  // Run the chain
  const response = await retrievalChain.invoke({
    input: userQuestion,
  });

  return response.answer;
}

// Example Usage (Uncomment to test)
// askBot("How much are the fees?").then(console.log);

module.exports = { askBot };
```

---

## 🔌 Step 3: Connect to Your Server

Now, update your main `index.js` to use this new AI function instead of the old SQL query.

**In `index.js`:**

```javascript
const { askBot } = require("./ai-bot"); // Import the new AI file

// ... inside your /chat endpoint ...

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    // OLD WAY: db.get("SELECT ...")

    // NEW WAY:
    const aiResponse = await askBot(userMessage);
    res.json({ reply: aiResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI Error" });
  }
});
```

---

## 🚀 Summary of Changes

1.  **Old Way**: User types "Fees" -> Database looks for exact word "Fees" -> Returns hardcoded text.
2.  **New Way**: User types "How much do I have to pay?" -> AI searches for _meaning_ -> Finds the "Fees" section -> Reads it -> Writes a natural answer: _"The fees for the first year are..."_

This makes your bot feel smart and conversational while keeping it 100% accurate to your data.
