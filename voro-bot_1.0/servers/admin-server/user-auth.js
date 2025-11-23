const bcrypt = require('bcryptjs');

// Setup user authentication routes
function setupUserAuthRoutes(app, db) {
  // User entry (no password, just save data and create session)
  app.post('/api/user/entry', async (req, res) => {
    if (!db) {
      res.status(503).json({ error: 'Database not initialized' });
      return;
    }

    try {
      const { full_name, grade, roll_number, email } = req.body;

      // Validation
      if (!full_name || !grade || !roll_number || !email) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      // Check if user exists by email or roll number
      db.get(
        'SELECT id, full_name FROM users WHERE email = ? OR roll_number = ?',
        [email, roll_number],
        function(err, existingUser) {
          if (err) {
            console.error('Error checking user:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
          }

          if (existingUser) {
            // User exists, update their data and create session
            db.run(
              'UPDATE users SET full_name = ?, grade = ?, roll_number = ?, email = ?, last_login = CURRENT_TIMESTAMP, login_count = login_count + 1 WHERE id = ?',
              [full_name, grade, roll_number, email, existingUser.id],
              function(updateErr) {
                if (updateErr) {
                  console.error('Error updating user:', updateErr);
                  res.status(500).json({ error: 'Failed to update user data' });
                  return;
                }

                // Set session
                req.session.userId = existingUser.id;
                req.session.username = full_name;

                // Track session
                db.run(
                  'INSERT INTO user_sessions (user_id, session_id) VALUES (?, ?)',
                  [existingUser.id, req.sessionID]
                );

                // Track login
                db.run(
                  'INSERT INTO user_logins (user_id, username) VALUES (?, ?)',
                  [existingUser.id, full_name]
                );

                res.json({
                  success: true,
                  message: 'Welcome back!',
                  user: {
                    id: existingUser.id,
                    full_name,
                    grade,
                    roll_number,
                    email
                  }
                });
              }
            );
          } else {
            // New user, create account
            db.run(
              'INSERT INTO users (username, email, password_hash, full_name, grade, roll_number) VALUES (?, ?, ?, ?, ?, ?)',
              [email, email, 'no-password', full_name, grade, roll_number],
              function(insertErr) {
                if (insertErr) {
                  console.error('Error creating user:', insertErr);
                  res.status(500).json({ error: 'Failed to create user' });
                  return;
                }

                const userId = this.lastID;

                // Set session
                req.session.userId = userId;
                req.session.username = full_name;

                // Track session
                db.run(
                  'INSERT INTO user_sessions (user_id, session_id) VALUES (?, ?)',
                  [userId, req.sessionID]
                );

                // Track login
                db.run(
                  'INSERT INTO user_logins (user_id, username) VALUES (?, ?)',
                  [userId, full_name]
                );

                res.json({
                  success: true,
                  message: 'Account created successfully!',
                  user: {
                    id: userId,
                    full_name,
                    grade,
                    roll_number,
                    email
                  }
                });
              }
            );
          }
        }
      );
    } catch (error) {
      console.error('Error in user entry:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // User logout
  app.post('/api/user/logout', (req, res) => {
    const sessionId = req.sessionID;
    const userId = req.session.userId;

    // Remove session from database
    if (userId && sessionId) {
      db.run(
        'DELETE FROM user_sessions WHERE user_id = ? AND session_id = ?',
        [userId, sessionId]
      );
    }

    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ error: 'Failed to logout' });
        return;
      }
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });

  // Get current user profile
  app.get('/api/user/profile', (req, res) => {
    if (!req.session.userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    if (!db) {
      res.status(503).json({ error: 'Database not initialized' });
      return;
    }

    db.get(
      'SELECT id, username, email, full_name, created_at, last_login FROM users WHERE id = ?',
      [req.session.userId],
      (err, user) => {
        if (err) {
          console.error('Error fetching user:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }

        if (!user) {
          res.status(404).json({ error: 'User not found' });
          return;
        }

        res.json({ user });
      }
    );
  });

  // Check auth status
  app.get('/api/user/check-auth', (req, res) => {
    res.json({
      authenticated: !!req.session.userId,
      username: req.session.username || null
    });
  });
}

// Middleware to protect user routes
function requireUserAuth(req, res, next) {
  if (!req.session.userId) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  next();
}

module.exports = {
  setupUserAuthRoutes,
  requireUserAuth
};
