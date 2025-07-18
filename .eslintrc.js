module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/prop-types': 'off', // 如果你不使用 prop-types 可以关闭
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'off', // 禁用 no-explicit-any 规则
    "@typescript-eslint/no-explicit-any": "off"
  },
};
