# FLOWCHART GENERATION PROMPT FOR VOROAI CHATBOT SYSTEM

Create a comprehensive flowchart for the VoroAI Chatbot System that shows all pages, user interactions, decision points, and system flows. Use the following detailed specifications:

## SYSTEM OVERVIEW
The VoroAI system is a campus chatbot with 5 main HTML pages, backend API endpoints, database interactions, and admin functionality. The flowchart should show complete user journeys from entry to exit.

## PAGES AND THEIR FUNCTIONS

### PAGE 1: ROOT (/)
- **URL**: /
- **Function**: Entry point that automatically redirects
- **Action**: Immediately redirects to /chatbot
- **No user interaction needed**

### PAGE 2: USER LOGIN (/user/login)
- **URL**: /user/login
- **File**: user-login.html
- **Purpose**: Student/user authentication
- **Elements**:
  * Username input field
  * Password input field
  * Login button
  * "Sign Up" link (goes to /user/signup)
  * "Forgot Password" option
- **User Actions**:
  1. Enter username
  2. Enter password
  3. Click "Login" button
- **System Actions**:
  * Validates credentials against database
  * If valid: Creates session, redirects to /chatbot
  * If invalid: Shows error message "Invalid credentials"
  * If user doesn't exist: Shows error message
- **Decision Points**:
  * Are credentials correct? (YES → /chatbot, NO → show error)
  * Does user have account? (NO → redirect to /user/signup)

### PAGE 3: USER SIGNUP (/user/signup)
- **URL**: /user/signup
- **File**: user-signup.html
- **Purpose**: New user registration
- **Elements**:
  * Username input field
  * Email input field
  * Password input field
  * Confirm Password input field
  * Sign Up button
  * "Already have account? Login" link (goes to /user/login)
- **User Actions**:
  1. Enter username
  2. Enter email
  3. Enter password
  4. Confirm password
  5. Click "Sign Up" button
- **System Actions**:
  * Validates all fields are filled
  * Checks if username already exists
  * Checks if email already exists
  * Validates password match
  * Hashes password using bcrypt
  * Saves user to database
  * If successful: Shows success message, redirects to /user/login
  * If error: Shows specific error message
- **Decision Points**:
  * Are all fields filled? (NO → show "All fields required")
  * Does username exist? (YES → show "Username taken")
  * Does email exist? (YES → show "Email already registered")
  * Do passwords match? (NO → show "Passwords don't match")
  * All validations pass? (YES → create account → redirect to login)

### PAGE 4: CHATBOT (/chatbot)
- **URL**: /chatbot
- **File**: chatbot.html
- **Purpose**: Main chatbot interface for asking questions
- **Header Elements**:
  * Logo "VORO-BOT"
  * Back button (hidden initially, shows when in conversation)
  * Feedback button (opens feedback modal)
  * Contact Support button (opens contact modal)
  * Theme toggle button (switches light/dark mode)
  * Logout button (destroys session, redirects to /user/login)
- **Main Chat Area**:
  * Messages container (shows conversation history)
  * Initial greeting: "Hi there! I'm Voro-bot, your campus guide. How can I help you today?"
  * Topic buttons (displayed initially):
    - Admissions
    - Fees
    - Hostel
    - Academics
    - Facilities
    - Placements
    - Contact
- **Input Area**:
  * Home button (resets chat to initial state)
  * Text input field (placeholder: "Type your query here...")
  * Send button (paper plane icon)
- **Modals**:
  * Feedback Modal (form to submit feedback)
  * Contact Support Modal (shows phone, email, address)

**USER INTERACTION FLOWS**:

**Flow A: Topic Button Click**
1. User clicks topic button (e.g., "Fees")
2. System displays user message in chat
3. System shows typing indicator
4. System sends request to /api/reply with topic keyword
5. Backend queries database for matching information
6. System displays bot response with detailed information
7. System may show follow-up option buttons
8. User can click option button or type new question

**Flow B: Text Input**
1. User types question in input field
2. User clicks Send button OR presses Enter key
3. System displays user message in chat
4. System shows typing indicator
5. System sends POST request to /api/reply with user input
6. Backend processes question:
   - Extracts keywords
   - Searches database using keyword matching
   - Retrieves relevant answer
7. System displays bot response
8. If no match found: Shows fallback message asking to rephrase
9. Query is saved to database for admin review
10. User can continue conversation

**Flow C: Feedback Submission**
1. User clicks Feedback button in header
2. Feedback modal opens with form:
   - Message textarea (required)
   - Name input (optional, auto-filled if logged in)
   - Email input (optional)
   - Submit button
3. User fills form and clicks Submit
4. System sends POST request to /api/feedback
5. Backend validates message is not empty
6. Backend saves to feedback table in database
7. System shows success message
8. Modal closes
9. Feedback appears in admin panel

**Flow D: Contact Support**
1. User clicks Contact Support button
2. Contact modal opens showing:
   - Phone number (clickable to call)
   - Email address (clickable to email)
   - Physical address
3. User can click to call/email or close modal

**Flow E: Theme Toggle**
1. User clicks theme toggle button
2. System checks current theme
3. If light mode: Switches to dark mode, icon changes to sun
4. If dark mode: Switches to light mode, icon changes to moon
5. Preference saved in browser localStorage
6. All colors update smoothly with CSS transitions

**Flow F: Logout**
1. User clicks Logout button
2. System sends request to destroy session
3. Backend destroys session data
4. System redirects to /user/login
5. User must login again to access chatbot

**Flow G: Home/Reset**
1. User clicks Home button
2. System clears chat messages
3. System resets to initial state
4. Shows welcome message and topic buttons again

### PAGE 5: ADMIN LOGIN (/login)
- **URL**: /login
- **File**: login.html
- **Purpose**: Admin authentication
- **Elements**:
  * Admin Username input
  * Admin Password input
  * Login button
- **User Actions**:
  1. Enter admin username
  2. Enter admin password
  3. Click Login
- **System Actions**:
  * Validates against admin_users table
  * If valid: Creates admin session, redirects to /admin
  * If invalid: Shows error "Invalid admin credentials"
- **Decision Points**:
  * Are admin credentials correct? (YES → /admin, NO → show error)

### PAGE 6: ADMIN PANEL (/admin)
- **URL**: /admin
- **File**: admin.html
- **Purpose**: Administrative dashboard
- **Access**: Requires admin session (redirects to /login if not authenticated)
- **Tabs/Sections**:
  1. **Queries Tab**
     - Shows all user queries from database
     - Displays: Query text, User name, Timestamp, Status
     - Actions: Mark as resolved, Delete
  2. **Feedback Tab**
     - Shows all feedback submissions
     - Displays: Message, User name, Email, Timestamp, Status
     - Actions: Mark as reviewed, Reply, Delete
  3. **Users Tab**
     - Shows all registered users
     - Displays: Username, Email, Registration date
     - Actions: View details, Delete user
  4. **Analytics Tab** (if implemented)
     - Query statistics
     - Most asked questions
     - User activity graphs
  5. **Settings Tab**
     - Update college information
     - Manage chatbot responses
     - Add/edit FAQ entries

**ADMIN INTERACTION FLOWS**:

**Flow A: View Queries**
1. Admin logs in successfully
2. Admin panel loads with Queries tab active
3. System fetches all queries from database via /api/admin/queries
4. Displays queries in table format
5. Admin can filter by status (new, resolved)
6. Admin can search queries
7. Admin clicks on query to view details
8. Admin can mark as resolved
9. Status updates in database

**Flow B: Manage Feedback**
1. Admin clicks Feedback tab
2. System fetches feedback via /api/admin/feedback
3. Displays feedback entries
4. Admin can:
   - Read feedback messages
   - Mark as reviewed
   - Delete inappropriate feedback
   - Export to CSV

**Flow C: User Management**
1. Admin clicks Users tab
2. System fetches user list via /api/admin/users
3. Displays all registered users
4. Admin can:
   - View user details
   - See user activity
   - Delete user account (with confirmation)

**Flow D: Update Information**
1. Admin clicks Settings tab
2. System loads current college information
3. Admin can edit:
   - Admission details
   - Fee structure
   - Hostel information
   - Contact details
4. Admin clicks Save
5. System validates changes
6. Updates database
7. Shows success message
8. Changes reflect immediately in chatbot

**Flow E: Admin Logout**
1. Admin clicks Logout button
2. System destroys admin session
3. Redirects to /login

## BACKEND API ENDPOINTS

### POST /api/reply
- **Purpose**: Process chatbot queries
- **Input**: { userInput: "question text" }
- **Process**:
  1. Receive user question
  2. Extract keywords
  3. Query college_data table
  4. Match keywords with database entries
  5. Retrieve best matching answer
  6. If no match: Return fallback message
  7. Save query to queries table
- **Output**: { reply: "answer text" }

### POST /api/feedback
- **Purpose**: Save user feedback
- **Input**: { message: "text", user_name: "name", user_email: "email" }
- **Process**:
  1. Validate message is not empty
  2. Get username from session if logged in
  3. Insert into feedback table
  4. Return success response
- **Output**: { success: true, message: "Thank you for feedback" }

### POST /api/queries
- **Purpose**: Save user queries
- **Input**: { message: "query text", user_name: "name", user_email: "email" }
- **Process**:
  1. Validate message
  2. Get username from session
  3. Insert into queries table
  4. Return automated response
- **Output**: { success: true, reply: "automated message" }

### GET /api/topics
- **Purpose**: Get all available topics
- **Process**: Query database for topic list
- **Output**: Array of topic objects

### POST /api/admin/login
- **Purpose**: Admin authentication
- **Input**: { username: "admin", password: "pass" }
- **Process**:
  1. Query admin_users table
  2. Compare password hash
  3. Create admin session if valid
- **Output**: { success: true } or { error: "message" }

### GET /api/admin/queries
- **Purpose**: Get all user queries for admin
- **Access**: Requires admin session
- **Output**: Array of query objects

### GET /api/admin/feedback
- **Purpose**: Get all feedback for admin
- **Access**: Requires admin session
- **Output**: Array of feedback objects

### GET /api/admin/users
- **Purpose**: Get all registered users
- **Access**: Requires admin session
- **Output**: Array of user objects

## DATABASE TABLES

### users
- **Columns**: id, username, email, password (hashed), created_at
- **Purpose**: Store student/user accounts
- **Used by**: Login, Signup, Admin panel

### admin_users
- **Columns**: id, username, password (hashed), created_at
- **Purpose**: Store admin accounts
- **Used by**: Admin login

### queries
- **Columns**: id, query, user_name, user_email, status, timestamp
- **Purpose**: Store all user questions
- **Used by**: Chatbot, Admin panel

### feedback
- **Columns**: id, message, user_name, user_email, status, timestamp
- **Purpose**: Store user feedback
- **Used by**: Feedback form, Admin panel

### college_data
- **Columns**: id, topic, question, reply, keywords
- **Purpose**: Store chatbot knowledge base
- **Used by**: Chatbot query processing

## DECISION POINTS FOR FLOWCHART

1. **Is user logged in?**
   - YES → Allow access to /chatbot
   - NO → Redirect to /user/login

2. **Are login credentials valid?**
   - YES → Create session → Redirect to /chatbot
   - NO → Show error message

3. **Does username already exist?** (Signup)
   - YES → Show "Username taken" error
   - NO → Continue validation

4. **Do passwords match?** (Signup)
   - YES → Create account
   - NO → Show error

5. **Is query found in database?**
   - YES → Return matching answer
   - NO → Return fallback message

6. **Is admin authenticated?**
   - YES → Show admin panel
   - NO → Redirect to /login

7. **Is feedback message empty?**
   - YES → Show validation error
   - NO → Save to database

8. **Which topic button clicked?**
   - Admissions → Show admission info
   - Fees → Show fee structure
   - Hostel → Show hostel details
   - Etc.

## COMPLETE USER JOURNEYS

### Journey 1: New User First Visit
START → / → Auto redirect → /user/login → Click "Sign Up" → /user/signup → Fill form → Submit → Validation → Create account → /user/login → Enter credentials → Login → /chatbot → See welcome message → Click topic button → See response → Type follow-up question → Get answer → Click Logout → /user/login → END

### Journey 2: Returning User
START → / → Auto redirect → /user/login → Enter credentials → Login → /chatbot → Type question → Get answer → Submit feedback → Feedback saved → Continue chatting → Click Logout → END

### Journey 3: Admin Workflow
START → /login → Enter admin credentials → Login → /admin → View Queries tab → See user questions → Mark as resolved → Switch to Feedback tab → Read feedback → Mark as reviewed → Switch to Settings → Update fee information → Save changes → Logout → END

## FLOWCHART STRUCTURE REQUIREMENTS

Create the flowchart with these specifications:

1. **Use standard flowchart symbols**:
   - Oval/Rounded Rectangle: Start/End points
   - Rectangle: Process/Action
   - Diamond: Decision point
   - Parallelogram: Input/Output
   - Cylinder: Database operation
   - Document: Page/Screen

2. **Color coding**:
   - Blue: User actions
   - Green: System processes
   - Red: Error states
   - Yellow: Decision points
   - Purple: Database operations
   - Orange: Admin actions

3. **Organize by sections**:
   - Section 1: User Authentication Flow (Login/Signup)
   - Section 2: Chatbot Interaction Flow
   - Section 3: Admin Panel Flow
   - Section 4: Backend API Processing
   - Section 5: Database Operations

4. **Show all connections**:
   - Arrows indicating flow direction
   - Labels on decision branches (Yes/No, Success/Fail)
   - Loop-back arrows for retry scenarios
   - Exit points clearly marked

5. **Include annotations**:
   - Page names and URLs
   - Key functions
   - Important validations
   - Error messages

6. **Make it comprehensive** showing:
   - Every page transition
   - Every user action
   - Every system response
   - Every database query
   - Every decision point
   - Every error scenario
   - Every success path

Generate a detailed, professional flowchart that a developer or stakeholder can use to understand the complete system flow from start to finish.
