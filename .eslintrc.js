module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    // quotes: ["error", "single"],
    // semi: ["error", "always"],
    /* Indentation */
    "no-mixed-spaces-and-tabs": 2,
    "indent-legacy": [2, 2],
    /* Variable names */
    "no-undef": 2,
    camelcase: 2,
    /* Language constructs */
    curly: 2,
    eqeqeq: [2, "smart"],
    "func-style": [2, "expression"],
    /* Semicolons */
    semi: 2,
    "no-extra-semi": 2,
    /* Padding & additional whitespace (perferred but optional) */
    "brace-style": [2, "1tbs", { allowSingleLine: true }],
    "semi-spacing": 1,
    "key-spacing": 1,
    "block-spacing": 1,
    "comma-spacing": 1,
    "no-multi-spaces": 1,
    "space-before-blocks": 1,
    "keyword-spacing": [1, { before: true, after: true }],
    "space-infix-ops": 1,
    /* Variable declaration */
    "one-var": [1, { uninitialized: "always", initialized: "never" }],
    /* Minuta */
    "comma-style": [2, "last"],
    quotes: [1, "single"],
    "max-len": [1, { code: 100 }]
  }
};
