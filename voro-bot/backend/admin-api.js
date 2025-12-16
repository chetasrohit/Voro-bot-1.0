const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { DB_PATH } = require("./database");

// Get database connection
function getDb() {
  return new sqlite3.Database(DB_PATH);
}

// Admin API Routes
function setupAdminRoutes(app, requireAdminAuth) {
  // Apply authentication middleware to all admin API routes
  app.use("/api/admin", requireAdminAuth);

  // Get all topics
  app.get("/api/admin/topics", (req, res) => {
    const db = getDb();
    db.all(
      `
      SELECT 
        t.*,
        COUNT(o.id) as option_count
      FROM topics t
      LEFT JOIN options o ON t.id = o.topic_id
      GROUP BY t.id
      ORDER BY t.id
    `,
      (err, topics) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(topics);
        db.close();
      }
    );
  });

  // Get single topic with options
  app.get("/api/admin/topics/:id", (req, res) => {
    const db = getDb();
    const topicId = req.params.id;

    db.get("SELECT * FROM topics WHERE id = ?", [topicId], (err, topic) => {
      if (err) {
        res.status(500).json({ error: err.message });
        db.close();
        return;
      }

      if (!topic) {
        res.status(404).json({ error: "Topic not found" });
        db.close();
        return;
      }

      db.all(
        "SELECT * FROM options WHERE topic_id = ? ORDER BY option_key",
        [topicId],
        (err, options) => {
          if (err) {
            res.status(500).json({ error: err.message });
            db.close();
            return;
          }

          res.json({ ...topic, options });
          db.close();
        }
      );
    });
  });

  // Create new topic
  app.post("/api/admin/topics", (req, res) => {
    const { key, name, icon } = req.body;

    if (!key || !name) {
      res.status(400).json({ error: "Key and name are required" });
      return;
    }

    const db = getDb();
    db.run(
      "INSERT INTO topics (key, name, icon, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
      [key, name, icon || "📌"],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          db.close();
          return;
        }

        res.json({ id: this.lastID, key, name, icon: icon || "📌" });
        db.close();
      }
    );
  });

  // Update topic
  app.put("/api/admin/topics/:id", (req, res) => {
    const { name, icon } = req.body;
    const topicId = req.params.id;

    const db = getDb();
    db.run(
      "UPDATE topics SET name = ?, icon = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [name, icon, topicId],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          db.close();
          return;
        }

        if (this.changes === 0) {
          res.status(404).json({ error: "Topic not found" });
          db.close();
          return;
        }

        res.json({ message: "Topic updated successfully" });
        db.close();
      }
    );
  });

  // Delete topic
  app.delete("/api/admin/topics/:id", (req, res) => {
    const topicId = req.params.id;
    const db = getDb();

    db.run("DELETE FROM topics WHERE id = ?", [topicId], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        db.close();
        return;
      }

      if (this.changes === 0) {
        res.status(404).json({ error: "Topic not found" });
        db.close();
        return;
      }

      res.json({ message: "Topic deleted successfully" });
      db.close();
    });
  });

  // Get all options for a topic
  app.get("/api/admin/topics/:topicId/options", (req, res) => {
    const topicId = req.params.topicId;
    const db = getDb();

    db.all(
      "SELECT * FROM options WHERE topic_id = ? ORDER BY option_key",
      [topicId],
      (err, options) => {
        if (err) {
          res.status(500).json({ error: err.message });
          db.close();
          return;
        }

        res.json(options);
        db.close();
      }
    );
  });

  // Create new option
  app.post("/api/admin/topics/:topicId/options", (req, res) => {
    const topicId = req.params.topicId;
    const { option_key, title, description, answer } = req.body;

    if (!option_key || !title || !answer) {
      res
        .status(400)
        .json({ error: "option_key, title, and answer are required" });
      return;
    }

    const db = getDb();
    db.run(
      "INSERT INTO options (topic_id, option_key, title, description, answer, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
      [topicId, option_key.toUpperCase(), title, description || "", answer],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          db.close();
          return;
        }

        res.json({
          id: this.lastID,
          topic_id: topicId,
          option_key: option_key.toUpperCase(),
          title,
          description: description || "",
          answer,
        });
        db.close();
      }
    );
  });

  // Update option
  app.put("/api/admin/options/:id", (req, res) => {
    const optionId = req.params.id;
    const { title, description, answer } = req.body;

    if (!title || !answer) {
      res.status(400).json({ error: "title and answer are required" });
      return;
    }

    const db = getDb();
    db.run(
      "UPDATE options SET title = ?, description = ?, answer = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [title, description || "", answer, optionId],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          db.close();
          return;
        }

        if (this.changes === 0) {
          res.status(404).json({ error: "Option not found" });
          db.close();
          return;
        }

        res.json({ message: "Option updated successfully" });
        db.close();
      }
    );
  });

  // Delete option
  app.delete("/api/admin/options/:id", (req, res) => {
    const optionId = req.params.id;
    const db = getDb();

    db.run("DELETE FROM options WHERE id = ?", [optionId], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        db.close();
        return;
      }

      if (this.changes === 0) {
        res.status(404).json({ error: "Option not found" });
        db.close();
        return;
      }

      res.json({ message: "Option deleted successfully" });
      db.close();
    });
  });

  // Get all feedback
  app.get("/api/admin/feedback", (req, res) => {
    const db = getDb();
    db.all(
      "SELECT * FROM feedback ORDER BY created_at DESC",
      (err, feedback) => {
        if (err) {
          res.status(500).json({ error: err.message });
          db.close();
          return;
        }
        res.json(feedback);
        db.close();
      }
    );
  });

  // Get all user logins
  app.get("/api/admin/logins", (req, res) => {
    const db = getDb();
    db.all(
      `SELECT 
        l.id,
        l.username,
        l.login_time,
        u.full_name,
        u.grade,
        u.roll_number,
        u.email
      FROM user_logins l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.login_time DESC`,
      (err, logins) => {
        if (err) {
          res.status(500).json({ error: err.message });
          db.close();
          return;
        }
        res.json(logins);
        db.close();
      }
    );
  });

  // Get single feedback
  app.get("/api/admin/feedback/:id", (req, res) => {
    const db = getDb();
    const feedbackId = req.params.id;

    db.get(
      "SELECT * FROM feedback WHERE id = ?",
      [feedbackId],
      (err, feedback) => {
        if (err) {
          res.status(500).json({ error: err.message });
          db.close();
          return;
        }

        if (!feedback) {
          res.status(404).json({ error: "Feedback not found" });
          db.close();
          return;
        }

        res.json(feedback);
        db.close();
      }
    );
  });

  // Update feedback status
  app.put("/api/admin/feedback/:id", (req, res) => {
    const feedbackId = req.params.id;
    const { status } = req.body;

    if (!status || !["new", "read", "replied", "archived"].includes(status)) {
      res.status(400).json({
        error: "Valid status is required (new, read, replied, archived)",
      });
      return;
    }

    const db = getDb();
    db.run(
      "UPDATE feedback SET status = ? WHERE id = ?",
      [status, feedbackId],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          db.close();
          return;
        }

        if (this.changes === 0) {
          res.status(404).json({ error: "Feedback not found" });
          db.close();
          return;
        }

        res.json({ message: "Feedback status updated successfully" });
        db.close();
      }
    );
  });

  // Delete feedback
  app.delete("/api/admin/feedback/:id", (req, res) => {
    const feedbackId = req.params.id;
    const db = getDb();

    db.run("DELETE FROM feedback WHERE id = ?", [feedbackId], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        db.close();
        return;
      }

      if (this.changes === 0) {
        res.status(404).json({ error: "Feedback not found" });
        db.close();
        return;
      }

      res.json({ message: "Feedback deleted successfully" });
      db.close();
    });
  });

  // ========== QUERIES ENDPOINTS (NEW) ==========

  // Get all queries
  app.get("/api/admin/queries", (req, res) => {
    const db = getDb();
    db.all("SELECT * FROM queries ORDER BY created_at DESC", (err, queries) => {
      if (err) {
        res.status(500).json({ error: err.message });
        db.close();
        return;
      }
      res.json(queries);
      db.close();
    });
  });

  // Update query status
  app.put("/api/admin/queries/:id", (req, res) => {
    const queryId = req.params.id;
    const { status } = req.body;

    if (!status || !["new", "read", "replied", "archived"].includes(status)) {
      res.status(400).json({
        error: "Valid status is required (new, read, replied, archived)",
      });
      return;
    }

    const db = getDb();
    db.run(
      "UPDATE queries SET status = ? WHERE id = ?",
      [status, queryId],
      function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          db.close();
          return;
        }

        if (this.changes === 0) {
          res.status(404).json({ error: "Query not found" });
          db.close();
          return;
        }

        res.json({ message: "Query status updated successfully" });
        db.close();
      }
    );
  });

  // Delete query
  app.delete("/api/admin/queries/:id", (req, res) => {
    const queryId = req.params.id;
    const db = getDb();

    db.run("DELETE FROM queries WHERE id = ?", [queryId], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        db.close();
        return;
      }

      if (this.changes === 0) {
        res.status(404).json({ error: "Query not found" });
        db.close();
        return;
      }

      res.json({ message: "Query deleted successfully" });
      db.close();
    });
  });

  // ========== CHAT LOGS ENDPOINTS (NEW) ==========

  // Get all chat logs
  app.get("/api/admin/chats", (req, res) => {
    const db = getDb();
    db.all(
      "SELECT * FROM chat_logs ORDER BY created_at DESC LIMIT 200",
      (err, chats) => {
        if (err) {
          res.status(500).json({ error: err.message });
          db.close();
          return;
        }
        res.json(chats);
        db.close();
      }
    );
  });

  // ========== USER MANAGEMENT ENDPOINTS ==========

  // Get all users with login statistics
  app.get("/api/admin/users", (req, res) => {
    const db = getDb();
    db.all(
      `
      SELECT 
        u.id,
        u.username,
        u.email,
        u.full_name,
        u.login_count,
        u.created_at,
        u.last_login
      FROM users u
      ORDER BY u.created_at DESC
    `,
      (err, users) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(users);
        db.close();
      }
    );
  });

  // Get currently active/logged-in users
  app.get("/api/admin/users/active", (req, res) => {
    const db = getDb();
    db.all(
      `
      SELECT 
        u.id,
        u.username,
        u.email,
        s.created_at as login_time,
        s.last_active
      FROM users u
      INNER JOIN user_sessions s ON u.id = s.user_id
      ORDER BY s.last_active DESC
    `,
      (err, activeUsers) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json(activeUsers);
        db.close();
      }
    );
  });

  // Delete a user
  app.delete("/api/admin/users/:id", (req, res) => {
    const db = getDb();
    const userId = req.params.id;

    // First check if user exists
    db.get(
      "SELECT id, username FROM users WHERE id = ?",
      [userId],
      (err, user) => {
        if (err) {
          res.status(500).json({ error: err.message });
          db.close();
          return;
        }

        if (!user) {
          res.status(404).json({ error: "User not found" });
          db.close();
          return;
        }

        // Delete user (sessions will be deleted automatically due to CASCADE)
        db.run("DELETE FROM users WHERE id = ?", [userId], function (err) {
          if (err) {
            res.status(500).json({ error: err.message });
            db.close();
            return;
          }

          res.json({
            success: true,
            message: `User "${user.username}" deleted successfully`,
          });
          db.close();
        });
      }
    );
  });
}

module.exports = setupAdminRoutes;
