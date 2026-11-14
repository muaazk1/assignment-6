/* 
  Name: Mu'aaz Khan
  Date: 11.14.2026
  CSC 372-01

  This is the errorHandler.js page for assignment 6. It contains the error handling logic for the Triviabook API. 
  The errorHandler function processes errors and sends appropriate HTTP responses.
*/

// Error handling middleware. It captures errors thrown in the route handlers and sends a structured JSON response with the error message and status code.
function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  console.error(error);

  const requestedStatus = Number(error.statusCode || error.status);
  const statusCode = Number.isInteger(requestedStatus) && requestedStatus >= 400 && requestedStatus < 600
    ? requestedStatus
    : 500;

  res.status(statusCode).json({ error: error.message || 'Internal Server Error' });
}

export default errorHandler;
