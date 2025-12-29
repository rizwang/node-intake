# AI-Assisted Intake Triage System

A full-stack application that captures intake requests and routes them into an admin review queue using heuristic classification (keyword-based rules).

## Project Structure

```
.
├── client/          # React frontend (Vite)
│   ├── src/         # React source files
│   ├── package.json # Frontend dependencies
│   └── vite.config.js
├── server/          # Node.js backend (Express)
│   ├── routes/      # API routes
│   ├── middleware/  # Auth and validation middleware
│   ├── tests/       # API tests
│   ├── package.json # Backend dependencies
│   └── server.js    # Main server file
├── package.json     # Root package.json with scripts
└── README.md
```

## Features

- **Public Intake Form**: Submit intake requests with name, email, description, and urgency
- **Heuristic Classification**: Automatically categorizes intakes into:
  - `billing` - invoice, payment, billing issues
  - `technical_support` - login, errors, bugs, access issues
  - `new_matter_project` - quotes, new projects, engagements
  - `other` - everything else
- **Admin Queue**: Protected admin interface with:
  - List view with filtering by status and category
  - Sortable table headers (click any column to sort)
  - Detail view for each intake
  - Update status and internal notes

## Tech Stack

### Backend
- Node.js with Express
- SQLite database (better-sqlite3)
- HTTP Basic Authentication
- Input validation

### Frontend
- React with Vite
- React Router for navigation
- Modern CSS styling

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (for cloning the repository)

To verify your installations:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
git --version   # Should show git version
```

## Installation & Setup

### Step 1: Clone the Repository

If you have the project in a Git repository:
```bash
git clone https://github.com/rizwang/node-intake.git
cd node-intake
```

If you have the project files locally, navigate to the project directory:
```bash
cd "node-intake"  # or your project directory name
```

### Step 2: Install Dependencies

The project has dependencies in three locations:
1. Root directory (for running both server and client together)
2. Server directory (backend dependencies)
3. Client directory (frontend dependencies)

**Option A: Install All Dependencies at Once (Recommended)**

From the root directory, run:
```bash
npm run install:all
```

This command will:
- Install root dependencies (including `concurrently` for running both servers)
- Install server dependencies
- Install client dependencies

**Option B: Install Dependencies Manually**

If you prefer to install separately:

1. **Install root dependencies:**
```bash
npm install
```

2. **Install server dependencies:**
```bash
cd server
npm install
cd ..
```

3. **Install client dependencies:**
```bash
cd client
npm install
cd ..
```

### Step 3: Configure Environment Variables

1. Navigate to the `server` directory:
```bash
cd server
```

2. Create a `.env` file:
```bash
# On Windows (PowerShell)
New-Item -Path .env -ItemType File

# On Windows (Command Prompt)
type nul > .env

# On Linux/Mac
touch .env
```

3. Open the `.env` file and add the following content:
```env
PORT=3001
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

**Important Notes:**
- Replace `admin123` with a secure password of your choice
- This password will be used to access the admin interface
- Never commit the `.env` file to version control (it's already in `.gitignore`)

4. Return to the root directory:
```bash
cd ..
```

### Step 4: Start the Application

**Option A: Start Both Server and Client Together (Recommended)**

From the root directory:
```bash
npm start
```

This will start:
- **Backend server** on `http://localhost:3001`
- **Frontend client** on `http://localhost:3000`

You'll see output from both servers in the same terminal window with color-coded prefixes.

**Option B: Start Server and Client Separately**

Open two terminal windows:

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm start
```

**Terminal 2 - Start Frontend Client:**
```bash
cd client
npm run dev
```

### Step 5: Verify Installation

1. **Check Backend Server:**
   - Open your browser and go to: `http://localhost:3001/health`
   - You should see: `{"status":"ok"}`

2. **Check Frontend Client:**
   - Open your browser and go to: `http://localhost:3000`
   - You should see the intake form

3. **Test Admin Access:**
   - Go to: `http://localhost:3000/admin`
   - Enter the admin password you set in `.env`
   - You should see the admin queue interface

## Available Scripts

### Root Directory Scripts

- `npm start` - Start both server and client together
- `npm run dev` - Start both with auto-reload for server
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend client
- `npm run install:all` - Install all dependencies (root, server, client)
- `npm test` - Run server tests

### Server Directory Scripts

- `npm start` - Start the server
- `npm run dev` - Start server with auto-reload (watches for file changes)
- `npm test` - Run API tests

### Client Directory Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Troubleshooting

### Port Already in Use

If you see an error like "Port 3000 is already in use" or "Port 3001 is already in use":

**Windows:**
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Find process using port 3001
lsof -ti:3001

# Kill the process
kill -9 $(lsof -ti:3001)
```

Or change the port in:
- Server: Update `PORT` in `server/.env`
- Client: Update `port` in `client/vite.config.js`

### Database Errors

If you encounter database errors:
1. Delete the database file: `server/intakes.db`
2. Restart the server (it will recreate the database automatically)

### Module Not Found Errors

If you see "Cannot find module" errors:
```bash
# Reinstall all dependencies
npm run install:all
```

### CORS Errors

Make sure:
- Backend server is running on port 3001
- Frontend client is running on port 3000
- The proxy configuration in `client/vite.config.js` points to the correct backend URL

### Authentication Not Working

- Verify that `ADMIN_PASSWORD` is set in `server/.env`
- Make sure you're using the correct password when logging into the admin interface
- Check that the `.env` file is in the `server/` directory, not the root directory

## API Endpoints

### Public Endpoints

- `POST /api/intakes` - Create a new intake
  - Body: `{ name, email, description, urgency (1-5) }`
  - Returns: Created intake with classified category

### Protected Endpoints (Require HTTP Basic Auth)

- `GET /api/intakes` - List all intakes
  - Query params: `?status=new&category=billing`
  - Returns: Array of intakes sorted by created_at DESC

- `GET /api/intakes/:id` - Get single intake
  - Returns: Intake details

- `PATCH /api/intakes/:id` - Update intake
  - Body: `{ status?, internal_notes? }`
  - Returns: Updated intake

### Authentication

Admin endpoints require HTTP Basic Authentication:
- Username: `admin` (or any username)
- Password: Value from `ADMIN_PASSWORD` environment variable

Example using curl:
```bash
curl -u admin:your-password http://localhost:3001/api/intakes
```

## Heuristic Classification Rules

The classifier uses keyword matching on the intake description:

### Billing Category
Keywords: invoice, invoices, invoicing, payment, payments, bill, bills, billing, charge, charges, fee, fees, refund, refunds, cost, costs, pricing, price

### Technical Support Category
Keywords: login, log in, error, errors, broken, break, bug, bugs, can't access, cannot access, access denied, not working, doesn't work, crash, crashes, slow, password, reset password, connection, connectivity, network, down, outage

### New Matter/Project Category
Keywords: quote, quotes, quotation, new project, new matter, new engagement, proposal, proposals, engagement, engagements, start, starting, begin, beginning, onboard, onboarding, hire, hiring, retain, retainer

### Other Category
Default category when no keywords match.

**Note**: The classification is deterministic and case-insensitive. The first matching category (in order: billing, technical_support, new_matter_project) wins.

## Running Tests

From the server directory:
```bash
npm test
```

Tests cover:
1. Creating an intake (happy path)
2. Creating an intake with validation errors
3. Protected route authentication

## Database Schema

```sql
CREATE TABLE intakes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT NOT NULL,
  urgency INTEGER NOT NULL CHECK(urgency >= 1 AND urgency <= 5),
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK(status IN ('new', 'in_review', 'resolved')),
  internal_notes TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Usage Guide

### For End Users (Submitting Intakes)

1. **Access the Intake Form:**
   - Open your browser and navigate to `http://localhost:3000`
   - You'll see the intake submission form

2. **Submit an Intake:**
   - Fill in your name
   - Enter your email address
   - Write a description of your request
   - Select urgency level (1-5)
   - Click "Submit Intake"
   - The system will automatically classify your intake based on keywords in the description

### For Administrators

1. **Access Admin Queue:**
   - Navigate to `http://localhost:3000/admin`
   - Enter the admin password (set in `server/.env`)

2. **View and Filter Intakes:**
   - See all intakes in a table view
   - Use the Status dropdown to filter by status (new, in_review, resolved)
   - Use the Category dropdown to filter by category (billing, technical_support, etc.)
   - Click any column header to sort by that column (ID, Name, Email, Description, Category, Status, Urgency, Created Date)
   - Click the arrow indicators to see current sort direction

3. **View Intake Details:**
   - Click the "View" button on any intake row
   - See complete intake information
   - View internal notes (if any)

4. **Update Intake:**
   - In the detail view, change the status dropdown (new → in_review → resolved)
   - Add or edit internal notes
   - Click "Update Intake" to save changes

## Security Notes

- The admin password is stored in environment variables (never commit `.env`)
- HTTP Basic Auth is used for simplicity; in production, consider JWT or session-based auth
- Input validation is performed on all endpoints
- SQL injection protection via parameterized queries

## Development Notes

- The database file (`intakes.db`) is created automatically on first run
- Server auto-reloads on file changes when using `npm run dev`
- CORS is enabled for development (allows frontend to connect)

## AI Appendix

### Heuristic Classification Design

The classification system uses a deterministic keyword-based approach with no external LLM dependencies. The rules are designed to be:

1. **Transparent**: All classification logic is visible in `server/classifier.js`
2. **Auditable**: Each category has clearly defined keyword lists
3. **Deterministic**: Same input always produces the same output
4. **Maintainable**: Easy to add or modify keywords

### Classification Priority

The classifier checks categories in this order:
1. Billing (highest priority)
2. Technical Support
3. New Matter/Project
4. Other (default fallback)

This priority ensures that billing issues are caught first, followed by technical issues, then new business opportunities.

### Example Classifications

- "I can't login to my account" → `technical_support`
- "Need a quote for a new project" → `new_matter_project`
- "Invoice #12345 is incorrect" → `billing`
- "General inquiry about services" → `other`

### Future Enhancements

Potential improvements (not implemented):
- Multi-keyword matching (require 2+ keywords for higher confidence)
- Keyword weighting (some keywords more important than others)
- Context-aware classification (consider urgency, email domain, etc.)
- Machine learning model (would require external dependency)

## Development Workflow

### Making Changes

1. **Backend Changes:**
   - Edit files in `server/` directory
   - If using `npm run dev`, server will auto-reload
   - Test API endpoints using tools like Postman or curl

2. **Frontend Changes:**
   - Edit files in `client/src/` directory
   - Vite will hot-reload changes automatically
   - Changes appear immediately in the browser

3. **Database Changes:**
   - Database schema is defined in `server/database.js`
   - Delete `server/intakes.db` to reset the database
   - Database recreates automatically on server start

### Running Tests

From the root directory:
```bash
npm test
```

Or from the server directory:
```bash
cd server
npm test
```

Tests cover:
1. Creating an intake (happy path)
2. Creating an intake with validation errors
3. Protected route authentication

### Building for Production

**Build Frontend:**
```bash
cd client
npm run build
```

The production build will be in `client/dist/` directory.

**Start Production Server:**
```bash
cd server
NODE_ENV=production npm start
```

## Project Files Overview

### Key Files

- `server/server.js` - Main server entry point
- `server/routes/intakes.js` - API route handlers
- `server/classifier.js` - Heuristic classification logic
- `server/database.js` - Database setup and connection
- `server/middleware/auth.js` - Authentication middleware
- `server/middleware/validation.js` - Input validation
- `client/src/App.jsx` - Main React component
- `client/src/components/IntakeForm.jsx` - Public intake form
- `client/src/components/AdminQueue.jsx` - Admin queue interface
- `client/src/components/IntakeDetail.jsx` - Intake detail view

## Common Commands Reference

```bash
# Initial Setup
npm run install:all          # Install all dependencies
cd server && echo "PORT=3001\nADMIN_PASSWORD=your-password\nNODE_ENV=development" > .env

# Starting the Application
npm start                     # Start both server and client
npm run dev                   # Start with auto-reload

# Individual Services
npm run server                # Start only backend
npm run client                # Start only frontend

# Testing
npm test                      # Run all tests

# Development
cd server && npm run dev      # Server with auto-reload
cd client && npm run dev      # Client with hot-reload
```

## Support & Issues

If you encounter any issues:

1. **Check Prerequisites:** Ensure Node.js v18+ is installed
2. **Verify Dependencies:** Run `npm run install:all` again
3. **Check Environment:** Ensure `.env` file exists in `server/` directory
4. **Check Ports:** Ensure ports 3000 and 3001 are available
5. **Review Logs:** Check terminal output for error messages
6. **Reset Database:** Delete `server/intakes.db` and restart

## License

ISC


## AI Tools Used
- Tool(s): Cursor and Google Gemini
- First i upload all files to get the requirement in a net shell and then create a structure and than give prompt to cursor.

## High-impact Prompts (3–6 examples)
1- A web interface where users submit their name, email, urgency level, and a description of their issue.
2- A backend logic layer that scans the description for keywords (e.g., "invoice" for billing or "bug" for technical support) to assign a category automatically upon creation.
3- A protected area where staff can view a list of intakes (filterable by status/category), view specific details, and update internal notes or ticket status.
4- Four endpoints to handle creating, listing (with filtering/sorting), retrieving, and updating intake records.

1. Prompt goal:
   - What you asked for: Frontend will be in client folder and backend will in server folder
   - What you received: got same as it is but it create sperate package.json
   - How you validated / adjusted it: I then create a root package.json file to run the project from one command instead of starting frontend and backend server separately 


## One example where AI was wrong (required)
- What the AI suggested: AI suggested to start server separately
- Why it was incorrect: for test you need to go into two folders to install dependencies and npm command to start
- How you detected the issue: when i check the code and want to install the dependencies.
- What you changed: I added package.json file where i mention command to go in folders and run the commands from one file.

## Verification Approach
- Tests you wrote:
   1- Happy Path: POST /api/intakes creates a record and returns a 201 with the correct heuristic category.
   2- Validation Failure: POST /api/intakes with a missing email returns a 400 Bad Request.
   3- Auth Check: GET /api/intakes (admin list) returns a 401 if the Authorization header is missing or incorrect.
