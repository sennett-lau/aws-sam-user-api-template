exports.createUniqueConstraintTransactItems = (table, payload) => {
  const transactionItems = []
  for (const [key, value] of Object.entries(payload)) {
    transactionItems.push({
      Put: {
        TableName: table,
        Item: {
          constraintKey: `${key}#${value}`,
        },
        ConditionExpression: 'attribute_not_exists(constraintKey)',
      },
    })
  }

  return transactionItems
}

exports.deleteUniqueConstraintTransactItems = (table, payload) => {
  const transactionItems = []
  for (const [key, value] of Object.entries(payload)) {
    transactionItems.push({
      Delete: {
        TableName: table,
        Key: {
          constraintKey: `${key}#${value}`,
        },
      },
    })
  }

  return transactionItems
}
