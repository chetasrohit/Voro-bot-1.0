# VoroAI-Frontend - Organized Structure

## Overview

This folder contains the original chatbot frontend and backend files, now organized for clarity.

## Folder Structure

```
voroai-frontend/
├── organized/
│   ├── hosting/
│   │   └── frontend/       # Chatbot HTML interface
│   │       └── voroai-main.html
│   │
│   ├── server/             # Backend server files
│   │   ├── index.js        # Main server entry
│   │   ├── admin-api.js    # Admin API routes
│   │   ├── database.js     # Database operations
│   │   ├── user-auth.js    # User authentication
│   │   ├── seed-data.js    # Database seeding
│   │   ├── college_data.db # SQLite database
│   │   ├── package.json    # Dependencies
│   │   └── public/         # Static files
│   │
│   └── docs/               # Documentation files
│       ├── README.md
│       ├── README-ADMIN.md
│       └── ...
│
└── [original files]        # Original unorganized files (backup)
```

## Purpose of Each Folder

### `hosting/frontend/`

**Purpose**: HTML files for the chatbot interface

- Main chatbot page (voroai-main.html)
- User-facing interface

### `server/`

**Purpose**: Backend server code

- Express.js server
- API endpoints for chatbot
- Database operations
- User authentication

### `docs/`

**Purpose**: Documentation and guides

- Setup instructions
- Admin guides
- Reference materials

## Status

⚠️ **This is a BACKUP folder**

- The active server is now in `voro-bot_1.0/servers/chatbot-server/`
- This folder is kept for reference only
- Do not run servers from here

## Migration

All files have been migrated to the new `voro-bot_1.0` structure:

- Server files → `voro-bot_1.0/servers/chatbot-server/`
- HTML files → `voro-bot_1.0/hosting/frontend/`
- Docs → `voro-bot_1.0/docs/`
