module.exports = {
  root: true,
  ignorePatterns: [
    'dist',
    'dist_electron',
    'node_modules',
  ],
  env: {
    node: true,
  },
  plugins: [
    'vuetify',
  ],
  extends: [
    'vuetify',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-unused-vars': ['warn'],
    'import/no-useless-path-segments': ['error', {
      noUselessIndex: true,
    }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'class-methods-use-this': ['off'],
    'no-param-reassign': ['off'],
    'no-debugger': ['warn'],
    'no-console': ['off'],
    'max-len': ['warn'],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
      },
    },
  ],
};
