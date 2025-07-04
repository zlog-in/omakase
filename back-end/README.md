# Omakase Backend

A Node.js backend service for the Omakase project.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Add other environment variables as needed
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

## Project Structure

```
back-end/
├── src/
│   └── simple-monitor.js    # Main application file
├── package.json             # Project dependencies and scripts
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Available Scripts

- `npm start` - Start the application in production mode
- `npm run dev` - Start the application in development mode with auto-reload
- `npm test` - Run tests (not configured yet)

## Dependencies

- **express** - Web framework for Node.js
- **cors** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management

## Development Dependencies

- **nodemon** - Auto-restart server during development

## License

MIT
