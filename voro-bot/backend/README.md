# College Assistant Backend

A database-powered backend for the College Assistant chatbot with a full admin panel for managing topics and responses.

## Features

- ✅ **SQLite Database** - No separate database server needed, works offline
- ✅ **Admin Panel** - Beautiful web interface to manage all data
- ✅ **RESTful API** - Full CRUD operations for topics and options
- ✅ **Automatic Seeding** - Pre-populated with initial college data
- ✅ **Smart Search** - Natural language processing for user queries

## Setup Instructions

### 1. Install Node.js
- Download and install Node.js from [nodejs.org](https://nodejs.org/) (LTS version recommended)
- Verify installation:
  ```powershell
  node -v
  npm -v
  ```

### 2. Install Dependencies
Navigate to the backend folder and install packages:
```powershell
cd backend
npm install
```

This will install:
- `express` - Web server framework
- `sqlite3` - Database
- `cors` - Cross-origin resource sharing
- `nodemon` - Auto-restart on file changes (dev only)

### 3. Start the Server

**Development mode** (auto-restarts on changes):
```powershell
npm run dev
```

**Production mode**:
```powershell
npm start
```

The server will start on `http://localhost:4000`

### 4. Access the Admin Panel

Open your browser and go to:
```
http://localhost:4000/admin
```

## Database Structure

The database (`college_data.db`) is automatically created in the `backend` folder with two tables:

### Topics Table
- `id` - Primary key
- `key` - Unique identifier (e.g., "admissions", "housing")
- `name` - Display name (e.g., "🎓 Admissions")
- `icon` - Emoji icon
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Options Table
- `id` - Primary key
- `topic_id` - Foreign key to topics
- `option_key` - Single letter (A, B, C, etc.)
- `title` - Option title
- `description` - Brief description
- `answer` - Full response text
- `created_at` - Timestamp
- `updated_at` - Timestamp

## API Endpoints

### Chat API
- `POST /api/reply` - Get chatbot response
  ```json
  {
    "userInput": "tell me about housing"
  }
  ```

- `GET /api/topics` - Get all topics (for frontend menu)

### Admin API

**Topics:**
- `GET /api/admin/topics` - List all topics
- `GET /api/admin/topics/:id` - Get topic with options
- `POST /api/admin/topics` - Create new topic
- `PUT /api/admin/topics/:id` - Update topic
- `DELETE /api/admin/topics/:id` - Delete topic

**Options:**
- `GET /api/admin/topics/:topicId/options` - List options for a topic
- `POST /api/admin/topics/:topicId/options` - Create new option
- `PUT /api/admin/options/:id` - Update option
- `DELETE /api/admin/options/:id` - Delete option

## Using the Admin Panel

1. **View Topics**: Click "Topics" tab to see all topics
2. **Add Topic**: Click "Add Topic" tab, fill in:
   - Key (unique identifier, lowercase, no spaces)
   - Name (display name with emoji)
   - Icon (optional emoji)
3. **Edit Topic**: Click "View/Edit" on any topic card
4. **Add Options**: Inside topic view, click "Add New Option"
5. **Edit Options**: Click "Edit" on any option
6. **Delete**: Use "Delete" buttons (with confirmation)

## Frontend Integration

The frontend (`voroai-main.html`) is already configured to use the backend. Make sure:

1. Backend is running on `http://localhost:4000`
2. Frontend fetch URL points to the correct backend URL
3. CORS is enabled (already configured)

## Troubleshooting

**Database not initializing:**
- Check that `sqlite3` is installed: `npm list sqlite3`
- Delete `college_data.db` and restart server to recreate

**Port already in use:**
- Change port in `index.js`: `const PORT = process.env.PORT || 4000;`
- Or set environment variable: `$env:PORT=5000; npm start`

**Admin panel not loading:**
- Check server is running
- Check browser console for errors
- Verify `/admin` route is accessible

## File Structure

```
backend/
├── index.js          # Main server file
├── database.js       # Database initialization and queries
├── admin-api.js      # Admin API routes
├── admin.html        # Admin panel interface
├── college_data.db   # SQLite database (auto-created)
├── package.json      # Dependencies
└── README.md         # This file
```

## Next Steps

- Add authentication to admin panel
- Export/import database functionality
- Add search and filtering in admin panel
- Implement response templates
- Add analytics/logging


