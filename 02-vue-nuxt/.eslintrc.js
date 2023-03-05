module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    "jest/globals": true,
    "cypress/globals": true,
  },
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
  },
  extends: ["@nuxtjs", "plugin:nuxt/recommended", "prettier"],
  plugins: ["jest", "cypress"],
  // add your custom rules here
  rules: {
    "import/order": 0,
  },
};
