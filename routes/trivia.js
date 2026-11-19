/* 
  Name: Mu'aaz Khan
  Date: 11.14.2026
  CSC 372-01

  This is the trivia.js routes page for assignment 6. It contains the route handlers for the Triviabook API. Each route corresponds to a 
  specific endpoint and delegates to the appropriate controller function.
*/

import { Router } from 'express';
import {
  getAllTopicsController,
  getQuestionsByTopicController,
  getRandomQuestionController,
  checkAnswerController,
  addQuestionController
} from '../controllers/trivia.js';

const router = Router();

router.get('/topics', getAllTopicsController);
router.get('/topic/:topic', getQuestionsByTopicController);
router.get('/random', getRandomQuestionController);
router.post('/answer', checkAnswerController);
router.post('/question/add', addQuestionController);

export default router;