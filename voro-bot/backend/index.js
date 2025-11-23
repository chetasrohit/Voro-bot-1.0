require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
const { initDatabase, findAnswer } = require("./database");
const setupAdminRoutes = require("./admin-api");
const { setupUserAuthRoutes, requireUserAuth } = require("./user-auth");
const { setupAdminAuth, requireAdminAuth } = require("./admin-auth");

const app = express();
app.use(
  cors({
    origin: true, // Allow any origin in development
    credentials: true,
  })
);
app.use(express.json());
app.use(express.static("public"));

// Session middleware
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "voro-bot-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS in production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

let db = null;

// Initialize database on startup
initDatabase()
  .then((database) => {
    db = database;
    console.log("Database initialized successfully");

    // Setup routes that need the database
    setupAdminAuth(app); // Setup admin authentication
    setupAdminRoutes(app, requireAdminAuth); // Pass auth middleware
    setupUserAuthRoutes(app, db);

    // Start server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server ready on http://localhost:${PORT}`);
      console.log(`User login: http://localhost:${PORT}/user/login`);
      // Admin panel URL hidden from console for security
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });

// Main API endpoint for chat replies
app.post("/api/reply", async (req, res) => {
  if (!db) {
    res.status(503).json({ error: "Database not initialized" });
    return;
  }

  try {
    const { userInput } = req.body;
    const result = await findAnswer(db, userInput || "");

    if (result) {
      res.json({ reply: result.reply });
    } else {
      res.json({
        reply:
          'Could you share a bit more detail? Mention a topic like "housing" or "fees" so I can send the right info.',
      });
    }
  } catch (error) {
    console.error("Error processing reply:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all topics (for frontend menu)
app.get("/api/topics", (req, res) => {
  if (!db) {
    res.status(503).json({ error: "Database not initialized" });
    return;
  }

  const { getAllTopics } = require("./database");
  getAllTopics(db)
    .then((topics) => {
      res.json(topics);
    })
    .catch((err) => {
      console.error("Error fetching topics:", err);
      res.status(500).json({ error: "Internal server error" });
    });
});

// ========== PUBLIC ROUTES ==========

// Root redirect to chatbot
app.get("/", (req, res) => {
  res.redirect("/chatbot");
});

// User login page
app.get("/user/login", (req, res) => {
  res.sendFile(path.join(__dirname, "user-login.html"));
});

// User signup page
app.get("/user/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "user-signup.html"));
});

// ========== ADMIN ROUTES ==========

// Serve admin login page (public)
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Serve admin panel (protected)
app.get("/admin", requireAdminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

// ========== USER ROUTES (CHATBOT) ==========

// Serve chatbot (voroai-main.html) - requires user auth
app.get("/chatbot", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "voroai-main.html"));
});

// Submit feedback/comment
app.post("/api/feedback", (req, res) => {
  if (!db) {
    res.status(503).json({ error: "Database not initialized" });
    return;
  }

  try {
    const { message, user_name, user_email } = req.body;

    if (!message || message.trim() === "") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    // Use logged-in username from session if available, otherwise use provided name
    const finalUsername = req.session?.username || user_name || "Anonymous";

    db.run(
      "INSERT INTO feedback (message, user_name, user_email, status) VALUES (?, ?, ?, ?)",
      [message.trim(), finalUsername, user_email || null, "new"],
      function (err) {
        if (err) {
          console.error("Error saving feedback:", err);
          res.status(500).json({ error: "Failed to save feedback" });
          return;
        }

        res.json({
          success: true,
          message: "Thank you for your feedback! We will get back to you soon.",
          id: this.lastID,
        });
      }
    );
  } catch (error) {
    console.error("Error processing feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Submit query (from main chat)
app.post("/api/queries", (req, res) => {
  if (!db) {
    res.status(503).json({ error: "Database not initialized" });
    return;
  }

  try {
    const { message, user_name, user_email } = req.body;

    if (!message || message.trim() === "") {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    // Use logged-in username from session if available, otherwise use provided name
    const finalUsername = req.session?.username || user_name || "Anonymous";

    db.run(
      "INSERT INTO queries (query, user_name, user_email, status) VALUES (?, ?, ?, ?)",
      [message.trim(), finalUsername, user_email || null, "new"],
      function (err) {
        if (err) {
          console.error("Error saving query:", err);
          res.status(500).json({ error: "Failed to save query" });
          return;
        }

        res.json({
          success: true,
          message: "Query received",
          reply:
            "Thank you for reaching out. We are here to help with any questions you have. Feel free to share your queries anytime.",
          id: this.lastID,
        });
      }
    );
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get contact information
app.get("/api/contact", (req, res) => {
  res.json({
    phone: "+91-22-2413-1234", // TODO: Update with your college phone number
    email: "info@college.edu", // TODO: Update with your college email
    address: "College Address, City, State, PIN Code", // TODO: Update with your college address
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: db ? "connected" : "not initialized",
    timestamp: new Date().toISOString(),
  });
});
