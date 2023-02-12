module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: 'eslint:recommended',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'prefer-const': 'warn',
    'operator-linebreak': 'off',
    'import/no-extraneous-dependencies': 'off',
    'max-classes-per-file': 'off',
  },
}
