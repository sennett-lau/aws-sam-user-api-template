const { errorHandling } = require('../utils/errors')
const { deleteHeaders } = require('../utils/headers')
const { deleteUserController } = require('../controllers/user')

exports.deleteUserHandler = async (event) => {
  let response
  const headers = deleteHeaders

  const userId = event?.requestContext?.authorizer?.lambda?.userId

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing userId',
      }),
      headers,
    }
  }


  try {
    const payload = {
      userId,
    }

    await deleteUserController(payload)

    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User deleted',
      }),
      headers,
    }
  } catch (err) {
    response = errorHandling(err, headers)
  }

  return response
}
