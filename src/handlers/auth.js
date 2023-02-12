const { errorHandling } = require('../utils/errors')
const { postHeaders } = require('../utils/headers')
const { verifyToken } = require('../utils/jwt')
const { extractAccessToken } = require('../utils/auth')
const { userSignInController, userSignUpController } = require('../controllers/auth')

exports.userSignInHandler = async (event) => {
  let response
  const headers = postHeaders

  const payload = JSON.parse(event.body)

  if (!payload.username || !payload.password) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing username or password',
      }),
      headers,
    }
  }

  try {
    const token = await userSignInController(payload)

    response = {
      statusCode: 200,
      body: JSON.stringify({
        token,
      }),
      headers,
    }
  } catch (err) {
    response = errorHandling(err, headers)
  }

  return response
}

exports.userSignUpHandler = async (event) => {
  let response
  const headers = postHeaders

  const payload = JSON.parse(event.body)

  if (!payload.username || !payload.password) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing username or password',
      }),
      headers,
    }
  }

  try {
    const user = await userSignUpController(payload)

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

exports.authHandler = async (event) => {
  const bearer = event.headers?.authorization
  let decoded = false

  if (bearer) {
    const accessToken = extractAccessToken(bearer)

    if (accessToken) {
      try {
        decoded = await verifyToken(accessToken)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return {
    isAuthorized: true,
    context: {
      userId: decoded?.userId,
      username: decoded?.username,
      isAdmin: false,
    },
  }
}
