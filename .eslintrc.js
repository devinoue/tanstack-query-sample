module.exports = {
  root: true,
  // typescript-eslint/parser is necessary for
  // - https://github.com/infctr/eslint-plugin-typescript-sort-keys
  parser: '@typescript-eslint/parser',
  plugins: [
    // https://github.com/aladdin-add/eslint-plugin/tree/master/packages/autofix#eslint-plugin-autofix
    'autofix',
    // https://github.com/sweepline/eslint-plugin-unused-imports
    'unused-imports',
    // https://github.com/infctr/eslint-plugin-typescript-sort-keys
    'typescript-sort-keys',
  ],
  extends: [
    'next',
    'next/core-web-vitals',
    // 最後Prettierを実行するためにprettierをextendsの最後に置くこと
    // https://github.com/prettier/eslint-config-prettier#installation
    'prettier',
  ],
  rules: {
    // https://github.com/aladdin-add/eslint-plugin/tree/master/packages/autofix#install--usage
    // 'autofix/no-unused-vars': [
    //   'warn',
    //   {
    //     vars: 'all',
    //     varsIgnorePattern: '^(_|unused_)',
    //   },
    // ],
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-duplicates.md
    'import/no-duplicates': 'error',
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
    'import/order': [
      'error',
      {
        groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin', 'object', 'type'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    'unused-imports/no-unused-imports': 'error',
    'react/jsx-sort-props': 'error',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'function-declaration',
        unnamedComponents: 'function-expression',
      },
    ],
    'typescript-sort-keys/interface': 'error',
  },
}
