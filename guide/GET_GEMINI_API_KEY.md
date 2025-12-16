# 🔑 How to Get a Free Google Gemini API Key

Follow these simple steps to get your API key for Voro-Bot.

### Step 1: Visit Google AI Studio

Go to this URL: **[https://aistudio.google.com/](https://aistudio.google.com/)**

### Step 2: Sign In

- Click **"Sign in to Google AI Studio"**.
- Login with your normal Google/Gmail account.
- _Note: If asked, accept the Terms of Service._

### Step 3: Create the Key

1.  Look for a blue button on the top-left or top-right that says **"Get API key"**.
2.  Click **"Create API key"**.
3.  Select **"Create API key in new project"** (this is the easiest option).

### Step 4: Copy & Save

- You will see a long string of random characters (e.g., `AIzaSyD...`).
- **Copy this key immediately.**
- **Do not share it** with anyone.

---

### ⚠️ Where to put it?

Once you have the key, go to your `voro-bot/backend` folder, create a file named `.env`, and paste it like this:

```env
GOOGLE_API_KEY=your_copied_key_here
```
