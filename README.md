# Node/Express Triviabook API

A Node/Express API for trivia questions that connects to a Neon Postgres database.

## Database Schema

**topics**
- `id`
- `name`

**questions**
- `id`
- `topic_id`
- `question`
- `answer`
- `difficulty`

## Setup

1. Clone the repository:
   ```bash
   git clone <https://github.com/muaazk1/assignment-6.git>
   cd assignment-6
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a Neon Postgres project and copy its connection string.

4. Create a `.env` file in the project root with your database connection string:
   ```bash
   DATABASE_URL=your_neon_database_connection_string
   ```
5. Seed the database (automatically creates the tables):
   ```bash
   node --env-file=.env seed.js
   ```
6. Start the server:
   ```bash
   node --env-file=.env server.js
   ```
    The server will run on `http://localhost:3000` by default.

## Endpoints

- `GET /triviabook/topics`: List all topics
- `GET /triviabook/topic/:topic`: List questions in a topic (with optional `limit` and `difficulty` query parameters)
- `GET /triviabook/random`: Get one random question, without the answer
- `POST /triviabook/answer`: Check a guess (body: `id`, `guess`)
- `POST /triviabook/question/add`: Add a question (body: `topic`, `question`, `answer`, `difficulty`)