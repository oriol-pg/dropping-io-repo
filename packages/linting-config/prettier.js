/** @type {import('prettier').Config} */
const config = {
  // Your preferred rules
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,

  // These are often crucial for monorepos to avoid broken formatting on cross-package imports
  plugins: [],
};

module.exports = config;
