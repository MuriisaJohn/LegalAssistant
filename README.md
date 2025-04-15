# Legal Assistant

A modern web application that provides AI-powered legal assistance, document analysis, and legal information retrieval, with a focus on Ugandan law.

## Overview

Legal Assistant is a full-stack application that combines a React-based frontend with an Express.js backend. It uses OpenRouter API to provide AI-powered legal assistance, allowing users to ask questions about Ugandan law and upload documents for analysis.

## Features

- **AI Legal Assistant**: Ask questions about Ugandan law and receive informative responses
- **Document Analysis**: Upload legal documents (PDF, DOC, DOCX, TXT) for AI-powered analysis
- **Contextual Responses**: AI responses are tailored to the specific legal context of Uganda
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Real-time Chat**: Interactive chat interface for legal queries

## Technology Stack

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: Type-safe JavaScript for better development experience
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Radix UI**: Unstyled, accessible components for building high-quality design systems
- **Framer Motion**: Animation library for React
- **React Query**: Data fetching and state management
- **Wouter**: Lightweight routing for React applications
- **Axios**: Promise-based HTTP client for API requests

### Backend
- **Express.js**: Web application framework for Node.js
- **TypeScript**: Type-safe JavaScript for the server
- **OpenRouter API**: AI service for generating legal responses
- **Multer**: Middleware for handling file uploads
- **Zod**: TypeScript-first schema validation
- **Drizzle ORM**: TypeScript ORM for database operations

### Development Tools
- **Vite**: Next-generation frontend tooling
- **ESBuild**: JavaScript bundler
- **TSX**: TypeScript execution engine
- **PostCSS**: CSS transformation tool
- **Tailwind CSS**: Utility-first CSS framework

## Project Structure

```
LegalAssistant/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Feature-specific components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and API clients
│   │   ├── pages/          # Page components
│   │   ├── services/       # Service layer for API calls
│   │   └── types/          # TypeScript type definitions
│   └── index.html          # HTML entry point
├── server/                 # Backend Express application
│   ├── features/           # Feature-specific modules
│   ├── lib/                # Utility functions
│   ├── routes/             # API route definitions
│   ├── types/              # TypeScript type definitions
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # Main routes configuration
│   ├── storage.ts          # Data storage implementation
│   └── vite.ts             # Vite integration for development
├── shared/                 # Shared code between client and server
│   └── schema.ts           # Shared data schemas
├── .env                    # Environment variables
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── tailwind.config.ts      # Tailwind CSS configuration
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/legal-assistant.git
   cd legal-assistant
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key
   APP_URL=http://localhost:3000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Ask Legal Questions**: Type your legal question in the chat interface and press Enter or click the Send button.
2. **Upload Documents**: Click the Upload button to upload a legal document for analysis.
3. **View Analysis**: After uploading a document, the AI will analyze it and provide a summary.
4. **Ask Document-Specific Questions**: Once a document is uploaded, you can ask questions specific to that document.

## API Configuration

The application uses OpenRouter API for AI-powered responses. The API key is configured in the `.env` file:

```
OPENROUTER_API_KEY=your_openrouter_api_key
```

The server is configured to use the DeepSeek model for generating responses:

```typescript
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
    'X-Title': 'Legal Assistant'
  }
});
```

## Development

### Running in Development Mode

```
npm run dev
```

This starts the development server with hot reloading enabled.

### Building for Production

```
npm run build
```

This builds the application for production deployment.

### Starting in Production Mode

```
npm run start
```

This starts the production server.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OpenRouter](https://openrouter.ai/) for providing the AI API
- [React](https://reactjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling 