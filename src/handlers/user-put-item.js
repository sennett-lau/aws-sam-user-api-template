const { errorHandling } = require('../utils/errors')
const { putHeaders } = require('../utils/headers')
const { updateUserController } = require('../controllers/user')

exports.updateUserHandler = async (event) => {
  let response
  const headers = putHeaders
  const userId = event?.requestContext?.authorizer?.lambda?.userId

  if (!userId) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: 'Unauthorized',
      }),
      headers,
    }
  }

  const body = JSON.parse(event.body)

  const payload = {
    userId,
    username: body?.username,
  }

  if (Object.values(payload).some((value) => !value)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing fields',
      }),
      headers,
    }
  }

  try {
    const user = await updateUserController(payload)

    response = {
      statusCode: 200,
      body: JSON.stringify({
        user,
      }),
      headers,
    }
  } catch (err) {
    response = errorHandling(err, headers)
  }

  return response
}
