# 🚀 Voro-Bot Portable Version - USB Pendrive Guide

## 📋 System Requirements

Before running Voro-Bot from your USB pendrive, ensure the target computer has:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Windows Operating System** (Windows 10/11)
- **Minimum 2GB RAM**
- **Internet connection** (for first-time dependency installation)

---

## 🎯 Quick Start Guide

### Step 1: Install Node.js (One-time setup on each computer)

1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version
3. Run the installer and follow the installation wizard
4. Restart your computer after installation

### Step 2: Run Voro-Bot from Pendrive

1. **Plug in your USB pendrive** containing the Voro-bot folder
2. **Navigate to the Voro-bot folder** (e.g., `E:\voroAi\`)
3. **Double-click** `START_VORO.bat`
4. **Wait for setup** (first time only - installs dependencies)
5. **Browser will open automatically** to `http://localhost:3000/`

That's it! 🎉

---

## 🌐 Accessing the Application

Once the server starts, you can access:

- **Chatbot Interface**: `http://localhost:3000/`
- **Admin Panel**: `http://localhost:3000/admin`

### Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

> ⚠️ **Important**: Change the default admin password after first login!

---

## 📁 Project Structure

```
voroAi/
├── START_VORO.bat          # ← Double-click this to start!
├── PENDRIVE_README.md      # ← You are here
├── voro-bot/
│   ├── backend/
│   │   ├── index.js        # Main server file
│   │   ├── ai-bot.js       # AI integration
│   │   ├── database.js     # SQLite database
│   │   ├── admin-api.js    # Admin API routes
│   │   └── package.json    # Dependencies
│   ├── voroai-main.html    # Chatbot interface
│   └── backend/admin.html  # Admin panel
└── guide/                  # Documentation guides
```

---

## 🔧 Troubleshooting

### Problem: "Node.js is not installed" error

**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/) and restart your computer.

### Problem: Port 3000 is already in use

**Solution**:

1. Close any applications using port 3000
2. Or modify the port in `voro-bot/backend/index.js` (line with `const PORT = 3000`)

### Problem: Dependencies installation fails

**Solution**:

1. Ensure you have internet connection
2. Try running as Administrator (Right-click `START_VORO.bat` → Run as administrator)
3. Delete `node_modules` folder and try again

### Problem: Browser doesn't open automatically

**Solution**: Manually open your browser and go to `http://localhost:3000/`

### Problem: Database errors

**Solution**: The SQLite database is stored in `voro-bot/backend/`. If corrupted, you can delete `voroai.db` to reset (you'll lose all data).

---

## 🔐 Security Notes

1. **Change default admin password** immediately after first login
2. **Don't expose to public internet** - this is meant for local use only
3. **Keep your pendrive safe** - it contains your database and all user data
4. **Backup regularly** - copy the entire `voroAi` folder to another location

---

## 💾 Database Location

Your SQLite database is stored at:

```
voro-bot/backend/voroai.db
```

This file contains:

- User login records
- Feedback submissions
- Chat logs
- Admin credentials

**Backup this file regularly!**

---

## 🆕 Updating the Application

To update Voro-Bot:

1. Pull latest changes from GitHub: `https://github.com/chetasrohit/Voro-bot-1.0`
2. Replace files on your pendrive
3. Delete `node_modules` folder
4. Run `START_VORO.bat` again (will reinstall dependencies)

---

## 📞 Support

For issues or questions:

- **GitHub Repository**: [https://github.com/chetasrohit/Voro-bot-1.0](https://github.com/chetasrohit/Voro-bot-1.0)
- **Documentation**: Check the `guide/` folder for detailed guides

---

## ✅ Features

- ✨ AI-powered chatbot with Google Gemini integration
- 👥 User feedback system
- 📊 Admin dashboard with analytics
- 💬 Chat history tracking
- 🔒 Secure admin authentication
- 📱 Responsive design for all devices

---

## 🎓 For Developers

### Manual Start (without batch script)

```bash
cd voro-bot/backend
npm install
npm start
```

### Environment Variables

Create a `.env` file in `voro-bot/backend/`:

```env
PORT=3000
GEMINI_API_KEY=your_api_key_here
SESSION_SECRET=your_secret_here
```

### Running in Development Mode

```bash
npm run dev
```

---

**Enjoy using Voro-Bot! 🤖💙**
