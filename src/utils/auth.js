const BEARER_TOKEN_PATTERN = /^Bearer[ ]+([^ ]+)[ ]*$/i

exports.extractAccessToken = (authorization) => {
  if (!authorization) {
    return null
  }

  const result = BEARER_TOKEN_PATTERN.exec(authorization)

  if (!result) {
    return null
  }

  return result[1]
}
