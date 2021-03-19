module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['standard', 'plugin:react/recommended', 'plugin:react-hooks/recommended', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  plugins: ['react', 'react-hooks'],
  globals: {
    SERVER: true,
    WeixinJSBridge: true,
    wx: true,
    qq: true,
  },
  rules: {
    'no-unused-vars': 0,
    'react/prop-types': 0,
    'react/display-name': 0,
    'prefer-regex-literals': 0, // 正则字面量
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
