require("dotenv").config();
const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const sqlite3 = require("sqlite3").verbose();

// 1. Setup the AI Model (Lazy Initialization)
let model = null;

function getModel() {
  if (model) {
    console.log("⚠️  Using cached model");
    return model;
  }

  console.log("🔄 Initializing new Ollama connection...");

  try {
    model = new ChatOpenAI({
      openAIApiKey: "not-needed", // Local server doesn't require authentication
      configuration: {
        baseURL: "http://localhost:11434/v1", // Ollama local server
      },
      modelName: "llama3.2:3b", // Ollama model name
      temperature: 0.7,
      maxTokens: 2048,
    });
    console.log("✓ Connected to Ollama at http://localhost:11434");
    return model;
  } catch (error) {
    console.error("❌ Failed to initialize Ollama model:", error);
    throw error;
  }
}

// 2. Database connection
const db = new sqlite3.Database("./college_data.db");

// 3. Load all data from database
async function loadAllData() {
  return new Promise((resolve, reject) => {
    db.all("SELECT title, answer FROM options", [], (err, rows) => {
      if (err) return reject(err);

      if (!rows || rows.length === 0) {
        console.warn("Warning: No data found in 'options' table.");
        return resolve([]);
      }

      // Format data as context string
      const contextData = rows
        .map((row) => `Q: ${row.title}\nA: ${row.answer}`)
        .join("\n\n");

      resolve(contextData);
    });
  });
}

// 4. The Main Function to Ask Questions
async function askBot(userQuestion) {
  try {
    console.log("Initializing AI for query:", userQuestion);

    // Load all data as context
    const context = await loadAllData();

    // Create the Prompt (Instructions for the AI)
    const prompt = ChatPromptTemplate.fromTemplate(`
      You are a helpful college assistant for Dr. Antonio Da Silva Technical High School.
      
      Instructions:
      1. Answer the user's question based ONLY on the following context.
      2. If the answer is not in the context, say "I'm sorry, I don't have that information yet."
      3. ALWAYS answer in ENGLISH, regardless of what language the user asks in.
      
      Context (College Information):
      {context}
      
      Question: {input}
      
      Answer:
    `);

    // Format the prompt with context and question
    const formattedPrompt = await prompt.format({
      context: context,
      input: userQuestion,
    });

    // Get response from AI
    const aiModel = getModel();
    const response = await aiModel.invoke(formattedPrompt);

    return response.content;
  } catch (error) {
    console.error("=== ERROR in askBot ===");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error:", error);
    console.error("=======================");

    // Check if it's a connection error to Ollama server
    if (
      error.message &&
      (error.message.includes("ECONNREFUSED") ||
        error.message.includes("fetch failed"))
    ) {
      return "I'm having trouble connecting to the local AI server. Please make sure Ollama is running at http://localhost:11434";
    }

    return "I'm having trouble processing your request right now. Please try again later.";
  }
}

module.exports = { askBot };
