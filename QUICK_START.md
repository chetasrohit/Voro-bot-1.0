# 🎯 Voro-Bot Quick Reference Card

## 🚀 Running from Pendrive

**Double-click**: `START_VORO.bat`

**URLs**:

- Chatbot: `http://localhost:3000/`
- Admin: `http://localhost:3000/admin`

**Admin Login**:

- Username: `admin`
- Password: `admin123`

---

## 📂 Important Files

| File                         | Purpose                 |
| ---------------------------- | ----------------------- |
| `START_VORO.bat`             | Launch script           |
| `PENDRIVE_README.md`         | Full documentation      |
| `voro-bot/backend/voroai.db` | Database (backup this!) |
| `voro-bot/backend/.env`      | Configuration           |

---

## ⚡ Quick Commands

```bash
# Manual start
cd voro-bot/backend
npm install
npm start

# Development mode
npm run dev
```

---

## 🔧 Common Issues

| Problem              | Solution                      |
| -------------------- | ----------------------------- |
| Node.js not found    | Install from nodejs.org       |
| Port 3000 in use     | Change PORT in index.js       |
| Dependencies fail    | Run as Administrator          |
| Browser doesn't open | Go to localhost:3000 manually |

---

## 💾 Backup Checklist

- [ ] Copy entire `voroAi` folder
- [ ] Especially `voro-bot/backend/voroai.db`
- [ ] Save `.env` file if configured

---

**Need help?** See `PENDRIVE_README.md` for full guide
