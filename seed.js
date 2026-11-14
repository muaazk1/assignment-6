import pool from './models/db.js';

let topics = ['science', 'geography'];

let scienceQuestions = [
    { question: 'What planet is known as the Red Planet?', answer: 'Mars', difficulty: 'easy' },
    { question: 'What is the chemical symbol for gold?', answer: 'Au', difficulty: 'medium' },
    { question: 'What is the powerhouse of the cell?', answer: 'Mitochondria', difficulty: 'easy' }
];

let geographyQuestions = [
    { question: 'What is the capital of Australia?', answer: 'Canberra', difficulty: 'medium' },
    { question: 'Which river flows through Cairo?', answer: 'The Nile', difficulty: 'easy' }
];

const questionsByTopic = {
    science: scienceQuestions,
    geography: geographyQuestions
};

const existing = await pool.query('SELECT COUNT(*) FROM questions');
if (Number(existing.rows[0].count) > 0) {
    console.log('Seeded data already exists.');
    await pool.end();
    process.exit();
}

for (const topic of topics) {
    const topicResult = await pool.query(
        'INSERT INTO topics (name) VALUES ($1) RETURNING id',
        [topic]
    );
    const topicId = topicResult.rows[0].id;

    for (const question of questionsByTopic[topic]) {
        await pool.query(
            'INSERT INTO questions (topic_id, question, answer, difficulty) VALUES ($1, $2, $3, $4)',
            [topicId, question.question, question.answer, question.difficulty]
        );
    }
}

console.log('Seeding done.');
await pool.end();