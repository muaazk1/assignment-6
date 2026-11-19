/* 
  Name: Mu'aaz Khan
  Date: 11.14.2026
  CSC 372-01

  This is the db.js page for assignment 6. It sets up the PostgreSQL database connection using the pg library and creates the necessary 
  tables for the Triviabook API if they do not already exist. The tables include 'topics' for storing trivia topics and 
  'questions' for storing trivia questions associated with those topics. The code makes sure that the database is ready for use by the application.
*/

import pg from 'pg';

// Creates a new PostgreSQL connection pool using the connection string from the environment variable
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Creates the 'topics' table if it does not already exist, with columns for id and name
await pool.query(`CREATE TABLE IF NOT EXISTS topics (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
)`);

// Creates the 'questions' table if it does not already exist, with columns for id, topic_id, question, answer, and difficulty
await pool.query(`CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY,
  topic_id INTEGER NOT NULL REFERENCES topics(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty TEXT NOT NULL
)`);

export default pool;