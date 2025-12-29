# Quick Start Guide

## Prerequisites
- Node.js v18+ installed
- npm or yarn

## Setup (5 minutes)

### Option 1: Single Command (Recommended)

1. Install all dependencies:
```bash
npm run install:all
```

2. Create `.env` file in `server/` directory:
```
PORT=3001
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

3. Start both server and client:
```bash
npm start
```

That's it! Both will start automatically.

### Option 2: Manual Setup

1. Backend Setup:
```bash
cd server
npm install
# Create .env file (see above)
npm start
```

2. Frontend Setup (new terminal):
```bash
cd client
npm install
npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Admin password: `admin123` (or whatever you set in `.env`)

## Test the Application

1. **Submit an Intake**: Go to http://localhost:3000 and fill out the form
2. **View Admin Queue**: Go to http://localhost:3000/admin and login
3. **Filter & Update**: Use filters and update intake status

## Run Tests
```bash
cd server
npm test
```

## Troubleshooting

- **Port already in use**: Change PORT in `.env` or kill the process using the port
- **Database errors**: Delete `intakes.db` and restart server (it will recreate)
- **CORS errors**: Make sure backend is running on port 3001
- **Auth not working**: Check that `ADMIN_PASSWORD` is set in `.env`

