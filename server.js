/* 
  Name: Mu'aaz Khan
  Date: 11.14.2026
  CSC 372-01

  This is the server.js file for assignment 6. It contains the main server logic and route configurations for the Triviabook API. 
  The server is set up using Express.js and listens for incoming requests on a specified port. 
  It also includes error handling middleware to manage any errors that occur during request processing.
*/

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