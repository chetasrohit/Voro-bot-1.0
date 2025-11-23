## 🛡️ Admin Guide (Administrator)
The Admin Panel gives you full control over the bot's knowledge base and user data.

### 1. Login
*   Visit the **Admin Login** page.
*   **Username**: `voroadmin`
*   **Password**: `voroadmin`

### 2. Managing Content (Topics & Options)
*   **View Topics**: The dashboard shows all available topics (Admissions, Housing, etc.).
*   **Add Topic**: Click **"Add New Topic"** to create a new category.
*   **Manage Options**: Click **"View"** on any topic to see its questions.
    *   **Add Option**: Click **"Add Option"**, enter a Title (the question) and the Answer. The system automatically assigns a key (A, B, C...).
    *   **Edit/Delete**: Use the buttons next to each option to modify or remove it.

### 3. Monitoring & Analytics
*   **Queries Tab**: View questions students have asked that the bot couldn't answer perfectly. Use this to improve your content.
*   **Feedback Tab**: Read messages sent by students. You can mark them as "Read" or "Replied".
*   **Users Tab**: See a list of all registered students and see who is currently online ("Active Users").

---

## ⚙️ How It Works (Functionality)
Voro-Bot operates on a simple but powerful flow:

1.  **Authentication**: The system verifies the user's session. If not logged in, they are redirected to the login page.
2.  **State Management**: The bot remembers where the user is (Menu -> Topic -> Answer). This allows the "Back" button to work intelligently.
3.  **Smart Matching**: When a user types a question, the backend searches the database for keywords matching specific Topics or Options.
    *   *Example*: If a user types "hostel", the bot finds the "Housing" topic and shows relevant answers.
4.  **Real-time Updates**: Changes made in the Admin Panel (like adding a new fee structure) are instantly available to students without restarting the server.