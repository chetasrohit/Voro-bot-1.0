const bcrypt = require("bcryptjs");

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "voroadmin";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD
  ? bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10)
  : bcrypt.hashSync("voroadmin", 10); // Default for development only

/**
 * Middleware to require admin authentication
 * Checks if user has valid admin session
 */
function requireAdminAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({
      error: "Unauthorized",
      message: "Admin authentication required",
    });
  }
}

/**
 * Setup admin authentication routes
 */
function setupAdminAuth(app) {
  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }

      // Verify credentials
      const usernameMatch = username === ADMIN_USERNAME;
      const passwordMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

      if (usernameMatch && passwordMatch) {
        // Set admin session
        req.session.isAdmin = true;
        req.session.adminUsername = username;

        res.json({
          success: true,
          message: "Login successful",
          username: username,
        });
      } else {
        res.status(401).json({
          error: "Invalid credentials",
          message: "Incorrect username or password",
        });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: "Failed to logout" });
        return;
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  // Check admin authentication status
  app.get("/api/admin/check-auth", (req, res) => {
    if (req.session && req.session.isAdmin) {
      res.json({
        authenticated: true,
        username: req.session.adminUsername,
      });
    } else {
      res.json({ authenticated: false });
    }
  });
}

module.exports = {
  setupAdminAuth,
  requireAdminAuth,
};
