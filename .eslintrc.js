module.exports = {
  env: {
    es2021: true,
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    'linebreak-style': 0,
    'no-console': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
      },
    ],
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-plusplus': 0,
    'no-underscore-dangle': 'off',
    'no-param-reassign': 0,
    'no-shadow': 'off',
  },
};
