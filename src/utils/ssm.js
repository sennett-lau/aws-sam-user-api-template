const aws = require('aws-sdk')

const ssm = new aws.SSM()
const env = process.env.ENV
const project = process.env.PROJECT

exports.getSecretString = async (name) => {
  const params = {
    Name: `/${project}/${env}/${name}`,
    WithDecryption: true,
  }

  return (await ssm.getParameter(params).promise()).Parameter.Value
}
