# ui-gen
UI Generator using AI

## Setup

1. Clone the repository
2. Install dependencies in both client and server directories:
```bash
cd client && npm install
cd ../server && npm install
```
3. Copy `.env.example` to `.env` in the server directory and add your Nebius API key:
```bash
cd server
cp .env.example .env
```
4. Update the `.env` file with your actual API key

## Development

Start the server:
```bash
cd server
npm start
```

Start the client:
```bash
cd client
npm run dev
```
