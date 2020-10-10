module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pages: {
    index: {
      entry: 'src/renderer/index.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Face Shield',
    },
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/main/index.js',
    },
  },
};
