module.exports = {
  root: true,
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
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'off',
      },
    },
    {
      files: ['src/main/*'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
