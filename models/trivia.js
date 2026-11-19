/* 
  Name: Mu'aaz Khan
  Date: 11.14.2026
  CSC 372-01

  This is the trivia.js model page for assignment 6. It contains the model functions for interacting with the PostgreSQL database. 
  Each function corresponds to a specific operation and handles the database queries.
*/

import pool from './db.js';

// Retrieves all topics from the database, ordered by their ID
async function getAllTopics() {
  const result = await pool.query('SELECT * FROM topics ORDER BY id');
  return result.rows;
}

// Retrieves a specific topic by its name from the database
async function getTopicByName(name) {
  const result = await pool.query('SELECT * FROM topics WHERE name = $1', [name]);
  return result.rows[0];
}

// Retrieves questions for a specific topic, with optional filtering by difficulty and limiting the number of results
async function getQuestionsByTopic(topic, difficulty, limit) {
  const result = await pool.query(
    `SELECT questions.id, questions.question, questions.answer, questions.difficulty
     FROM questions
     JOIN topics ON topics.id = questions.topic_id
     WHERE topics.name = $1
       AND ($2::text IS NULL OR questions.difficulty = $2)
     ORDER BY questions.id
     LIMIT $3::int`,
    [topic, difficulty || null, limit || null]
  );
  return result.rows;
}

// Retrieves a random question from the database, including its topic and difficulty but the answer is not included in the response
async function getRandomQuestion() {
  const result = await pool.query(
    `SELECT questions.id, topics.name AS topic, questions.question, questions.difficulty
     FROM questions
     JOIN topics ON topics.id = questions.topic_id
     ORDER BY RANDOM()
     LIMIT 1`
  );
  return result.rows[0];
}

// Retrieves a specific question by its ID from the database
async function getQuestionById(id) {
  const result = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);
  return result.rows[0];
}

// Adds a new question to the database, creating the topic if it does not already exist. It responds with the updated list of questions for the topic after insertion.
async function addQuestion(topic, question, answer, difficulty) {
  let topicRow = await getTopicByName(topic);

  if (!topicRow) {
    const newTopic = await pool.query(
      'INSERT INTO topics (name) VALUES ($1) RETURNING *',
      [topic]
    );
    topicRow = newTopic.rows[0];
  }

  const result = await pool.query(
    'INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4) RETURNING *',
    [topicRow.id, question, answer, difficulty]
  );
  return result.rows[0];
}

export {
  getAllTopics,
  getTopicByName,
  getQuestionsByTopic,
  getRandomQuestion,
  getQuestionById,
  addQuestion
};