const { getUserById, getUserByUsername, updateUser, deleteUser } = require('../models/user')
const { NotFoundError } = require('../utils/errors')

exports.getUserController = async (payload) => {
  let user
  if (payload.userId) {
    user = await getUserById(payload.userId)
  } else if (payload.username) {
    user = await getUserByUsername(payload.username)
  }

  return user
}

exports.updateUserController = async (payload) => {
  const user = await getUserById(payload.userId)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  const originalUsername = payload.username !== user.username ? user.username : ''

  return await updateUser(payload, originalUsername)
}

exports.deleteUserController = async (payload) => {
  const user = await getUserById(payload.userId)

  if (!user) {
    throw new NotFoundError('User not found')
  }

  return await deleteUser(user)
}
