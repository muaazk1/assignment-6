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