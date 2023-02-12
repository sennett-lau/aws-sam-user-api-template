const jwt = require('jsonwebtoken')

const { getSecretString } = require('../utils/ssm')

const generateToken = async (payload) => {
  const secret = await getJwtSecret()

  const user = {
    userId: payload.userId,
    username: payload.username,
    roles: ['USER'],
  }

  return jwt.sign(user, secret, { expiresIn: '3h' })
}

const verifyToken = async (token) => {
  const secret = await getJwtSecret()

  return jwt.verify(token, secret)
}

const getJwtSecret = async () => {
  return await getSecretString('jwt-secret')
}

module.exports = {
  generateToken,
  verifyToken,
}
