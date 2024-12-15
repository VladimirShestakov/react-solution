import eslint from '@eslint/js';
import tslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default tslint.config(
  eslint.configs.recommended,
  ...tslint.configs.recommended,
  prettier,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      //   'prettier/prettier': 'off',
      //   indent: ['error', 2, { SwitchCase: 1 }],
      //   semi: ['error', 'always'],
      //   'no-trailing-spaces': ['error', { skipBlankLines: true }],
      //   'no-unused-vars': 'off',
      //   'function-call-argument-newline': ['error', 'consistent'],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'react/prop-types': ['error', { ignore: ['dispatch'], skipUndeclared: true }],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
  },
  {
    ignores: ['dist/*'],
  },
);
