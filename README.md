# XImage - Grok Image Generation App

A modern web application for generating images using the xAI Grok image generation API.

## Features

- Generate images from text prompts
- View and download generated images
- Modern, responsive UI
- Secure API key handling

## Project Structure

- `frontend/` - React-based frontend application
- `backend/` - Node.js Express API server
- `docs/` - Project documentation

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone this repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

4. Set up environment variables (see below)

### Environment Variables

Create a `.env` file in the `backend` directory with the following:

```
PORT=3001
XAI_API_KEY=your_api_key_here
```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## API Documentation

The backend provides the following endpoints:

- `POST /api/generate` - Generate images from a text prompt
- `GET /api/images` - Get a list of previously generated images

## License

MIT
