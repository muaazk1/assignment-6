import pool from './db.js';

async function getAllTopics() {
  const result = await pool.query('SELECT * FROM topics ORDER BY id');
  return result.rows;
}

async function getTopicByName(name) {
  const result = await pool.query('SELECT * FROM topics WHERE name = $1', [name]);
  return result.rows[0];
}

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

async function getQuestionById(id) {
  const result = await pool.query('SELECT * FROM questions WHERE id = $1', [id]);
  return result.rows[0];
}


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