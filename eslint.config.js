import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Code quality rules (not formatting)
      'no-var': 'error',
      'prefer-const': 'error',
      'require-jsdoc': 'off',
      'valid-jsdoc': 'off',

      // Import formatting rules for multiline imports
      'object-curly-newline': [
        'error',
        {
          ImportDeclaration: {
            multiline: true,
            minProperties: 4, // More than 3 imports triggers multiline
          },
        },
      ],
    },
    ignores: ['node_modules/'],
  },
  // Disable ESLint formatting rules that conflict with Prettier
  eslintConfigPrettier,
];
