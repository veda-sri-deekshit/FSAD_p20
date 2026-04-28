# Backend API

Node.js/Express backend for the fullstack application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

- `GET /api/` - Welcome message
- `GET /api/health` - Health check

## Project Structure

```
src/
├── server.js       - Main server entry point
├── routes/         - API route definitions
├── controllers/    - Business logic controllers
└── middleware/     - Custom middleware
```

## Development

- Use `npm run dev` for development with auto-reload
- Use `npm start` for production
