class UnauthorizedError extends Error {}
class NotFoundError extends Error {}
class BadRequestError extends Error {}
class ConflictError extends Error {}

exports.errorHandling = (err, headers) => {
  let response

  if (err instanceof NotFoundError) {
    response = {
      statusCode: 404,
      body: JSON.stringify({
        message: `'Not Found: ${err.message}`,
      }),
      headers,
    }
  } else if (err instanceof UnauthorizedError) {
    response = {
      statusCode: 401,
      body: JSON.stringify({
        message: `Unauthorized: ${err.message}`,
      }),
      headers,
    }
  } else if (err instanceof BadRequestError) {
    response = {
      statusCode: 400,
      body: JSON.stringify({
        message: `Bad Request: ${err.message}`,
      }),
      headers,
    }
  } else {
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message,
      }),
      headers,
    }
  }

  return response
}

exports.UnauthorizedError = UnauthorizedError
exports.NotFoundError = NotFoundError
exports.BadRequestError = BadRequestError
exports.ConflictError = ConflictError
