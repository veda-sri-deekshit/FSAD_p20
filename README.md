"# Full Stack Application

A fullstack application with a React frontend (Vite) and Node.js/Express backend.

## Project Structure

```
FULLSTACK-main/
├── fedfw_p20/          # React frontend (Vite)
├── backend/            # Node.js/Express backend
└── README.md           # This file
```

## Setup Instructions

### Frontend Setup

```bash
cd fedfw_p20
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The backend API will be available at `http://localhost:5000`

## Running Both Simultaneously

In two separate terminals:

**Terminal 1 (Frontend):**
```bash
cd fedfw_p20
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd backend
npm run dev
```

## API Integration

The React frontend can make API calls to the backend using:
```javascript
fetch('http://localhost:5000/api/...')
```

For production, update the API base URL to your deployed backend URL.

## Build for Production

**Frontend:**
```bash
cd fedfw_p20
npm run build
```

**Backend:**
```bash
cd backend
npm start
```"
