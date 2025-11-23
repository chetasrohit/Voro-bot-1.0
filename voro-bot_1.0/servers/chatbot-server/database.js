const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'college_data.db');

// Initialize database
function initDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
        return;
      }
      console.log('Connected to SQLite database');
    });

    // Create tables
    db.serialize(() => {
      // Topics table
      db.run(`
        CREATE TABLE IF NOT EXISTS topics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          icon TEXT,
          keywords TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Options/Responses table
      db.run(`
        CREATE TABLE IF NOT EXISTS options (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          topic_id INTEGER NOT NULL,
          option_key TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          answer TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
          UNIQUE(topic_id, option_key)
        )
      `);

      // Feedback/Comments table
      db.run(`
        CREATE TABLE IF NOT EXISTS feedback (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          message TEXT NOT NULL,
          user_name TEXT,
          user_email TEXT,
          status TEXT DEFAULT 'new',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Queries table (New)
      db.run(`
        CREATE TABLE IF NOT EXISTS queries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          query TEXT NOT NULL,
          user_name TEXT,
          user_email TEXT,
          status TEXT DEFAULT 'new',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Users table for chatbot authentication
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          full_name TEXT,
          grade TEXT,
          student_id TEXT,
          roll_number TEXT,
          login_count INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_login DATETIME
        )
      `);

      // User sessions table for tracking active logins
      db.run(`
        CREATE TABLE IF NOT EXISTS user_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          session_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // User logins table for tracking login history
      db.run(`
        CREATE TABLE IF NOT EXISTS user_logins (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          username TEXT NOT NULL,
          login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

      // Check if database is empty and seed initial data
      db.get('SELECT COUNT(*) as count FROM topics', (err, row) => {
        if (err) {
          console.error('Error checking database:', err);
          reject(err);
          return;
        }

        if (row.count === 0) {
          console.log('Database is empty, seeding initial data...');
          seedInitialData(db).then(() => {
            resolve(db);
          }).catch(reject);
        } else {
          resolve(db);
        }
      });
    });
  });
}

// Seed initial data
function seedInitialData(db) {
  return new Promise((resolve, reject) => {
    const initialData = [
      {
        key: 'admissions',
        name: ' Admissions',
        icon: '',
        options: [
          {
            option_key: 'A',
            title: 'Application Process',
            description: 'Learn about requirements and deadlines',
            answer: 'Our admissions team reviews applications holistically. Contact: admissions@college.edu | Phone: (555) 123-4567 | Visit: admissions.college.edu'
          },
          {
            option_key: 'B',
            title: 'Campus Tours',
            description: 'Schedule a visit to campus',
            answer: 'We offer daily campus tours at 10 AM and 2 PM. Book online or contact our visitor center. Contact: tours@college.edu | Phone: (555) 123-4568'
          }
        ]
      },
      {
        key: 'fees',
        name: ' Fees & Financial Aid',
        icon: '',
        options: [
          {
            option_key: 'A',
            title: 'Tuition Information',
            description: 'Current semester costs',
            answer: 'Undergraduate tuition is $15,000 per semester. Contact the bursar for payment plans. Contact: bursar@college.edu | Phone: (555) 123-4569'
          },
          {
            option_key: 'B',
            title: 'Scholarships',
            description: 'Available financial aid options',
            answer: 'We offer merit-based and need-based scholarships. Apply through our portal. Contact: finaid@college.edu | Phone: (555) 123-4570'
          }
        ]
      },
      {
        key: 'housing',
        name: 'Housing',
        icon: '',
        options: [
          {
            option_key: 'A',
            title: 'Dormitories',
            description: 'On-campus living options',
            answer: 'We have 5 residence halls with single and shared rooms. Applications open in March. Contact: housing@college.edu | Phone: (555) 123-4571'
          },
          {
            option_key: 'B',
            title: 'Off-Campus Resources',
            description: 'Help finding local housing',
            answer: 'Visit our off-campus housing portal for listings and roommate matching. Contact: offcampus@college.edu | Phone: (555) 123-4572'
          }
        ]
      },
      {
        key: 'academics',
        name: ' Academics',
        icon: '',
        options: [
          {
            option_key: 'A',
            title: 'Course Registration',
            description: 'Enroll in classes',
            answer: 'Registration opens 2 weeks before each semester. Use the student portal. Contact: registrar@college.edu | Phone: (555) 123-4573'
          },
          {
            option_key: 'B',
            title: 'Academic Advising',
            description: 'Get guidance on your major',
            answer: 'Every student is assigned an advisor. Schedule appointments through the portal. Contact: advising@college.edu | Phone: (555) 123-4574'
          }
        ]
      },
      {
        key: 'services',
        name: 'Student Services',
        icon: '',
        options: [
          {
            option_key: 'A',
            title: 'Career Center',
            description: 'Job search and internships',
            answer: 'Our career center offers resume reviews, mock interviews, and job fairs. Contact: careers@college.edu | Phone: (555) 123-4575'
          },
          {
            option_key: 'B',
            title: 'Health & Wellness',
            description: 'Campus health services',
            answer: 'Free health services for all students. Mental health counseling also available. Contact: health@college.edu | Phone: (555) 123-4576'
          }
        ]
      },
      {
        key: 'campus',
        name: 'Campus Life',
        icon: '',
        options: [
          {
            option_key: 'A',
            title: 'Student Organizations',
            description: 'Join clubs and activities',
            answer: 'We have over 200 student organizations! Visit the student life office to explore. Contact: studentlife@college.edu | Phone: (555) 123-4577'
          },
          {
            option_key: 'B',
            title: 'Events & Activities',
            description: 'Upcoming campus events',
            answer: 'Check our events calendar for concerts, lectures, and social activities. Contact: events@college.edu | Phone: (555) 123-4578'
          }
        ]
      }
    ];

    const insertTopic = db.prepare(`
      INSERT INTO topics (key, name, icon) VALUES (?, ?, ?)
    `);

    const insertOption = db.prepare(`
      INSERT INTO options (topic_id, option_key, title, description, answer) 
      VALUES (?, ?, ?, ?, ?)
    `);

    let completed = 0;
    const total = initialData.length;

    initialData.forEach((topic) => {
      insertTopic.run([topic.key, topic.name, topic.icon], function(err) {
        if (err) {
          console.error('Error inserting topic:', err);
          reject(err);
          return;
        }

        const topicId = this.lastID;
        topic.options.forEach((option) => {
          insertOption.run([
            topicId,
            option.option_key,
            option.title,
            option.description,
            option.answer
          ], (err) => {
            if (err) {
              console.error('Error inserting option:', err);
              reject(err);
              return;
            }
          });
        });

        completed++;
        if (completed === total) {
          insertTopic.finalize();
          insertOption.finalize();
          console.log('Initial data seeded successfully');
          resolve();
        }
      });
    });
  });
}

// Get all topics with their options
function getAllTopics(db) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT 
        t.id, t.key, t.name, t.icon,
        o.id as option_id, o.option_key, o.title, o.description, o.answer
      FROM topics t
      LEFT JOIN options o ON t.id = o.topic_id
      ORDER BY t.id, o.option_key
    `, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      // Group by topic
      const topics = {};
      rows.forEach((row) => {
        if (!topics[row.key]) {
          topics[row.key] = {
            id: row.id,
            key: row.key,
            name: row.name,
            icon: row.icon,
            options: {}
          };
        }

        if (row.option_id) {
          topics[row.key].options[row.option_key] = {
            id: row.option_id,
            option_key: row.option_key,
            title: row.title,
            description: row.description,
            answer: row.answer
          };
        }
      });

      resolve(topics);
    });
  });
}

// Get single topic by key
function getTopicByKey(db, topicKey) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM topics WHERE key = ?', [topicKey], (err, topic) => {
      if (err) {
        reject(err);
        return;
      }
      if (!topic) {
        resolve(null);
        return;
      }

      db.all(
        'SELECT * FROM options WHERE topic_id = ? ORDER BY option_key',
        [topic.id],
        (err, options) => {
          if (err) {
            reject(err);
            return;
          }

          const optionsObj = {};
          options.forEach((opt) => {
            optionsObj[opt.option_key] = {
              id: opt.id,
              option_key: opt.option_key,
              title: opt.title,
              description: opt.description,
              answer: opt.answer
            };
          });

          resolve({
            ...topic,
            options: optionsObj
          });
        }
      );
    });
  });
}

// Find answer by searching in topics and options
function findAnswer(db, userInput) {
  return new Promise((resolve, reject) => {
    const normalized = userInput.trim().toLowerCase();

    if (!normalized) {
      resolve(null);
      return;
    }

    // Get all topics and options
    getAllTopics(db).then((topics) => {
      // Check for menu/help commands
      if (['menu', 'start', 'help'].includes(normalized)) {
        const topicNames = Object.values(topics).map(t => t.name).join(', ');
        resolve({
          type: 'menu',
          reply: `I can guide you through these areas: ${topicNames}. Ask about any topic or say "Option A for Housing" to get a detailed response.`
        });
        return;
      }

      // Search for topic match
      for (const [topicKey, topicValue] of Object.entries(topics)) {
        const sanitizedTopicName = topicValue.name.replace(/[^\w\s]/g, '').toLowerCase();
        const mentionsTopic = normalized.includes(topicKey) || normalized.includes(sanitizedTopicName);

        if (mentionsTopic) {
          // Check for specific option
          const optionMatch = normalized.match(/option\s*([a-z])/);
          if (optionMatch) {
            const optionKey = optionMatch[1].toUpperCase();
            if (topicValue.options[optionKey]) {
              resolve({
                type: 'answer',
                reply: topicValue.options[optionKey].answer
              });
              return;
            }
          }

          // Check for option title match
          for (const optionValue of Object.values(topicValue.options)) {
            const optionTitle = optionValue.title.toLowerCase();
            if (normalized.includes(optionTitle)) {
              resolve({
                type: 'answer',
                reply: optionValue.answer
              });
              return;
            }
          }

          // Return topic summary
          const options = Object.entries(topicValue.options)
            .map(([optKey, optValue]) => `Option ${optKey}: ${optValue.title} - ${optValue.description}`)
            .join(' | ');

          resolve({
            type: 'summary',
            reply: `${topicValue.name} help: ${options}. Mention something like "Option A for ${topicValue.name}" to get the full answer.`
          });
          return;
        }
      }

      // No match found
      getAllTopics(db).then((allTopics) => {
        const topicNames = Object.values(allTopics).map(t => t.name).join(', ');
        resolve({
          type: 'fallback',
          reply: `I'm still learning how to answer that. I can guide you through these areas: ${topicNames}. Ask about any topic or say "Option A for Housing" to get a detailed response.`
        });
      });
    }).catch(reject);
  });
}

module.exports = {
  initDatabase,
  getAllTopics,
  getTopicByKey,
  findAnswer,
  DB_PATH
};

