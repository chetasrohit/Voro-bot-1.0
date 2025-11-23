# ✅ Feedback & Support Features Added!

Your chatbot now has feedback functionality and a call support button!

## What's New:

### 1. **Feedback/Comments System**
- ✅ Text input now used for feedback/comments
- ✅ All feedback saved to database
- ✅ Users can submit questions or comments
- ✅ Feedback visible in admin panel

### 2. **Call Support Button**
- ✅ Added "📞 Call Support" button in header
- ✅ Shows college contact information:
  - Phone number (clickable to call)
  - Email (clickable to email)
  - Address

### 3. **Admin Panel Updates**
- ✅ New "Feedback" tab in admin panel
- ✅ View all user feedback/comments
- ✅ Update feedback status (New, Read, Replied, Archived)
- ✅ Delete feedback
- ✅ See user info (name, email if provided)

## How to Use:

### For Users (Frontend):

1. **Submit Feedback:**
   - Type your question or comment in the text box
   - Press Enter or click Send
   - Feedback is saved and you get a confirmation

2. **Contact Support:**
   - Click "📞 Call Support" button in header
   - See college phone, email, and address
   - Click phone to call or email to send email

### For Admins:

1. **View Feedback:**
   - Go to `http://localhost:4000/admin`
   - Click "Feedback" tab
   - See all user feedback/comments

2. **Manage Feedback:**
   - Change status using dropdown (New → Read → Replied → Archived)
   - Delete feedback if needed
   - See when feedback was submitted

## Update Contact Information:

Edit `backend/index.js` and update the contact info:

```javascript
app.get('/api/contact', (req, res) => {
  res.json({
    phone: '+91-XX-XXXX-XXXX', // Your college phone
    email: 'yourcollege@email.com', // Your college email
    address: 'Your College Address' // Your address
  });
});
```

## Database Structure:

New table created: `feedback`
- `id` - Primary key
- `message` - Feedback text
- `user_name` - User name (optional)
- `user_email` - User email (optional)
- `status` - Status (new, read, replied, archived)
- `created_at` - Timestamp

## API Endpoints:

### Submit Feedback:
```
POST /api/feedback
Body: { message: "user feedback", user_name: "optional", user_email: "optional" }
```

### Get Contact Info:
```
GET /api/contact
Returns: { phone, email, address }
```

### Admin - Get All Feedback:
```
GET /api/admin/feedback
```

### Admin - Update Feedback Status:
```
PUT /api/admin/feedback/:id
Body: { status: "read" }
```

### Admin - Delete Feedback:
```
DELETE /api/admin/feedback/:id
```

## Testing:

1. **Start Backend:**
   ```powershell
   cd backend
   npm run dev
   ```

2. **Test Feedback:**
   - Open `voroai-main.html`
   - Type a message in the text box
   - Click Send
   - Should see confirmation message

3. **Test Support Button:**
   - Click "📞 Call Support" button
   - Should see contact information modal

4. **View in Admin:**
   - Go to `http://localhost:4000/admin`
   - Click "Feedback" tab
   - See your submitted feedback

## Features:

✅ **Feedback Collection** - Users can submit questions/comments
✅ **Database Storage** - All feedback saved to SQLite
✅ **Admin View** - View all feedback in admin panel
✅ **Status Management** - Track feedback status
✅ **Contact Support** - Easy access to college contact info
✅ **Clickable Links** - Phone and email are clickable

---

**Everything is ready!** Users can now submit feedback and contact support! 🎉


