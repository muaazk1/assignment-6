import express from 'express';
import errorHandler from './middleware/errorHandler.js';
import triviaRouter from './routes/trivia.js';

const app = express();
app.use(express.json());

app.use('/triviabook', triviaRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});