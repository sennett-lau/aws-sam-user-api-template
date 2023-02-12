const { errorHandling } = require('../utils/errors')
const { getHeaders } = require('../utils/headers')
const { getUserController } = require('../controllers/user')

exports.getUserHandler = async (event) => {
  let response
  const headers = getHeaders

  const userId = event?.queryStringParameters?.userId || event?.requestContext?.authorizer?.lambda?.userId
  const username = event?.queryStringParameters?.username

  if (!userId && !username) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing userId or username',
      }),
      headers,
    }
  }

  try {
    const payload = {
      userId,
      username,
    }
    const user = await getUserController(payload)

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
