const dynamodb = require('aws-sdk/clients/dynamodb')

const { createUniqueConstraintTransactItems, deleteUniqueConstraintTransactItems } = require('./unique-field')
const table = process.env.USER_TABLE
const uniqueConstraintTable = process.env.UNIQUE_CONSTRAINT_TABLE

const docClient = new dynamodb.DocumentClient()

exports.getUserById = async (userId) => {
  const params = {
    TableName: table,
    Key: {
      userId,
    },
  }

  const data = await docClient.get(params).promise()

  return data.Item
}

exports.getUserByUsername = async (username) => {
  const params = {
    TableName: table,
    IndexName: 'UsernameIndex',
    KeyConditionExpression: '#username = :username',
    ExpressionAttributeNames: {
      '#username': 'username',
    },
    ExpressionAttributeValues: {
      ':username': username,
    },
  }

  const data = await docClient.query(params).promise()

  return data.Items?.[0]
}

exports.createUser = async (payload) => {
  const user = {
    userId: payload.userId,
    username: payload.username,
    password: payload.password,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  const uniqueConstraint = createUniqueConstraintTransactItems(uniqueConstraintTable, {username: user.username})

  const params = {
    TransactItems: [
      {
        Put: {
          TableName: table,
          Item: user,
        },
      },
      ...uniqueConstraint,
    ],
  }

  await docClient.transactWrite(params).promise()

  return user
}

exports.updateUser = async (payload, originalUsername) => {
  const { userId, ...rest } = payload

  const UpdateExpression = `SET ${Object.keys(rest).map((key) => `#${key} = :${key}`).join(', ')}`
  const ExpressionAttributeNames = Object.keys(rest).reduce((acc, key) => ({...acc, [`#${key}`]: key}), {})
  const ExpressionAttributeValues = Object.keys(rest).reduce(
    (acc, key) => ({...acc, [`:${key}`]: rest[key]}),
    {}
  )

  const params = {
    TransactItems: [
      {
        Update: {
          TableName: table,
          Key: {
            userId,
          },
          UpdateExpression,
          ExpressionAttributeNames,
          ExpressionAttributeValues,
        }
      },
    ],
  }

  if (originalUsername) {
    const createUniqueConstraint = createUniqueConstraintTransactItems(
        uniqueConstraintTable,
        {username: rest.username}
    )
    const deleteUniqueConstraint = deleteUniqueConstraintTransactItems(
        uniqueConstraintTable,
        {username: originalUsername}
    )

    params.TransactItems.push(...deleteUniqueConstraint)
    params.TransactItems.push(...createUniqueConstraint)
  }

  await docClient.transactWrite(params).promise()

  return payload
}

exports.deleteUser = async (payload) => {
  const { userId, username } = payload

  const deleteUniqueConstraint = deleteUniqueConstraintTransactItems(
    uniqueConstraintTable,
    {username}
  )

  const params = {
    TransactItems: [
      {
        Delete: {
          TableName: table,
          Key: {
            userId,
          },
        }
      },
      ...deleteUniqueConstraint,
    ],
  }

  await docClient.transactWrite(params).promise()

  return payload
}
