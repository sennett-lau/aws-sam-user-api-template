const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require("uuid")

const { generateToken } = require('../utils/jwt')
const { NotFoundError, UnauthorizedError, BadRequestError } = require('../utils/errors')
const { getUserByUsername, createUser } = require('../models/user')

exports.userSignInController = async (payload) => {
  const user = await getUserByUsername(payload.username)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password)

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid password')
  }

  return await generateToken(user)
}

exports.userSignUpController = async (payload) => {
  const user = await getUserByUsername(payload.username)

  if (user) {
    throw new BadRequestError('Username already exists')
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10)
  delete payload.password

  const userPayload = {
    userId: uuidv4(),
    username: payload.username,
    password: hashedPassword,
  }

  const newUser = await createUser(userPayload)

  delete newUser.password

  return newUser
}
