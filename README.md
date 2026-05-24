# Chat App (Frontend)

This is the React frontend for a real-time chat application.

## Tech Stack

- React (Create React App)
- Socket.IO client
- Axios
- Firebase Cloud Messaging
- Bootstrap / React Bootstrap

## Prerequisites

- Node.js (LTS recommended)
- npm

## Project Setup

1. Clone the repository.
2. Install dependencies:

```bash
npm ci
```

3. Start the development server:

```bash
npm start
```

4. Open:

```text
http://localhost:3000
```

## Available Scripts

### `npm start`
Runs the app in development mode.

### `npm test`
Runs the test suite once (CI mode):

```bash
CI=true npm test -- --watchAll=false
```

### `npm run build`
Creates a production build in the `build/` folder.

## Notes

- The frontend is currently configured to use this backend URL:
  - `https://chatappserver-zop9.onrender.com`
- Socket connection and REST API calls are hardcoded to that backend.
- Firebase config is defined in `src/firebase.js`.
