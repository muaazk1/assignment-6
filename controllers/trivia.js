/* 
  Name: Mu'aaz Khan
  Date: 11.14.2026
  CSC 372-01

  This is the trivia.js page for assignment 6. It contains the controller functions for the Triviabook API. Each function corresponds to a specific route and handles the request, 
  interacts with the model, and sends back a response. The functions include error handling to ensure that appropriate HTTP status codes and messages are returned for various scenarios.
*/

import {
  getAllTopics,
  getTopicByName,
  getQuestionsByTopic,
  getRandomQuestion,
  getQuestionById,
  addQuestion
} from '../models/trivia.js';

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

// Creates an error object with a status code and message for use in error handling
function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

// Controller that handles GET /triviabook/topics
async function getAllTopicsController(req, res, next) {
  try {
    const topics = await getAllTopics();
    res.status(200).json(topics);
  } catch (error) {
    next(error);
  }
}

// Controller that handles GET /triviabook/topic/:topic with optional query parameters for limit and difficulty
async function getQuestionsByTopicController(req, res, next) {
  try {
    const topic = req.params.topic.trim().toLowerCase();
    const { limit, difficulty } = req.query;

    const topicResult = await getTopicByName(topic);
    if (!topicResult) {
      return next(createHttpError(404, 'Topic not found'));
    }

    let difficultyValue;
    if (difficulty !== undefined) {
      difficultyValue = String(difficulty).trim().toLowerCase();
      if (!VALID_DIFFICULTIES.includes(difficultyValue)) {
        return next(createHttpError(400, 'Difficulty must be easy, medium, or hard'));
      }
    }

    let limitValue;
    if (limit !== undefined) {
      limitValue = Number(limit);
      if (!Number.isInteger(limitValue) || limitValue < 1) {
        return next(createHttpError(400, 'Limit must be a positive whole number'));
      }
    }

    const questions = await getQuestionsByTopic(topic, difficultyValue, limitValue);
    res.status(200).json(questions);
  } catch (error) {
    next(error);
  }
}

// Controller that handles GET /triviabook/random
async function getRandomQuestionController(req, res, next) {
  try {
    const question = await getRandomQuestion();
    if (!question) {
      return next(createHttpError(404, 'No questions found'));
    }
    res.status(200).json(question);
  } catch (error) {
    next(error);
  }
}

// Controller that handles POST /triviabook/answer with body: { id, guess }
async function checkAnswerController(req, res, next) {
  try {
    const { id, guess } = req.body;
    if (id === undefined || guess === undefined) {
      return next(createHttpError(400, 'id and guess are required'));
    }

    const questionId = Number(id);
    if (!Number.isInteger(questionId) || questionId < 1) {
      return next(createHttpError(400, 'id must be a positive whole number'));
    }

    const question = await getQuestionById(questionId);
    if (!question) {
      return next(createHttpError(404, 'Question not found'));
    }

    const correct = String(guess).trim().toLowerCase() === question.answer.trim().toLowerCase();
    res.status(200).json({ correct, answer: question.answer });
  } catch (error) {
    next(error);
  }
}

// Controller that handles POST /triviabook/question/add with body: { topic, question, answer, difficulty }
async function addQuestionController(req, res, next) {
  try {
    const { topic, question, answer, difficulty } = req.body;
    if (!topic || !question || !answer || !difficulty) {
      return next(createHttpError(400, 'topic, question, answer, and difficulty are required'));
    }

    const formattedTopic = String(topic).trim().toLowerCase();
    const formattedDifficulty = String(difficulty).trim().toLowerCase();
    if (!VALID_DIFFICULTIES.includes(formattedDifficulty)) {
      return next(createHttpError(400, 'Difficulty must be easy, medium, or hard'));
    }

    await addQuestion(formattedTopic, String(question).trim(), String(answer).trim(), formattedDifficulty);

    const questions = await getQuestionsByTopic(formattedTopic);
    res.status(201).json(questions);
  } catch (error) {
    next(error);
  }
}

export {
  getAllTopicsController,
  getQuestionsByTopicController,
  getRandomQuestionController,
  checkAnswerController,
  addQuestionController
};