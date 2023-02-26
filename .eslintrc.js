module.exports = {
  env: {
    browser: true,
    es2021: true,
    es6: true
  },
  extends: [
    // allegedly the only one needed
    'airbnb-typescript-prettier',
    'airbnb',
    'prettier',
    'plugin:@typescript-eslint/recommended',
    // from eslint-plugin-react
    // 'eslint:recommended',
    'plugin:react/recommended',
    // // 'airbnb-base',
    // 'plugin:prettier/recommended',
    // 'plugin:react-hooks/recommended',
    // // 'plugin:jsx-a11y/recommended',
    'plugin:import/typescript'
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    jsx: true
  },
  plugins: ['@typescript-eslint', 'react', 'import'], // 'react', 'prettier', '@typescript-eslint', 'react-hooks'
  // settings: { react: { version: 'detect' }, 'import/resolver': { node: { paths: ['src'] } } },
  rules: {
    'comma-dangle': [1, 'never'],
    'no-console': 0,
    'prettier/prettier': ['error'],
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-indent-props': [2, 4],
    'react/jsx-indent': [2, 4],
    'react/jsx-one-expression-per-line': [0],
    'react/prefer-stateless-function': [1],
    'react/static-property-placement': [1, 'property assignment'],
    'object-shorthand': ['error', 'never'],
    // new from eslint-plugin-react
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    // removing import errors
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ]
    // indent: ['error', 2],
    // 'linebreak-style': ['error', 'unix'],
    // // quotes: ["error", "single"],
    // // semi: ["error", "always"],
    // /* Indentation */
    // 'no-mixed-spaces-and-tabs': 2,
    // 'indent-legacy': [2, 2],
    // /* Variable names */
    // 'no-undef': 2,
    // camelcase: 2
    // /* Language constructs */
    // curly: 2,
    // eqeqeq: [2, 'smart'],
    // 'func-style': [2, 'expression'],
    // /* Semicolons */
    // semi: 2,
    // 'no-extra-semi': 2,
    // /* Padding & additional whitespace (perferred but optional) */
    // 'brace-style': [2, '1tbs', { allowSingleLine: true }],
    // 'semi-spacing': 1,
    // 'key-spacing': 1,
    // 'block-spacing': 1,
    // 'comma-spacing': 1,
    // 'no-multi-spaces': 1,
    // 'space-before-blocks': 1,
    // 'keyword-spacing': [1, { before: true, after: true }],
    // 'space-infix-ops': 1,
    // /* Variable declaration */
    // 'one-var': [1, { uninitialized: 'always', initialized: 'never' }],
    // /* Minuta */
    // 'comma-style': [2, 'last'],
    // quotes: [1, 'single'],
    // 'max-len': [1, { code: 100 }],
  }
};
// npm install typescript eslint prettier eslint-config-airbnb-typescript-prettier --save-dev
// npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint typescript
// npm install eslint-plugin-import --save-dev
