module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  pages: {
    index: {
      entry: 'src/renderer/index.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Face Shield',
    },
    overlay: {
      entry: 'src/overlay/index.js',
      template: 'public/index.html',
      filename: 'overlay.html',
      title: 'Face Shield Overlay',
    },
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/main/index.js',
      preload: {
        rendererPreload: 'src/renderer/preload.js',
        overlayPreload: 'src/overlay/preload.js',
      },
      builderOptions: {
        appId: 'io.github.doteq.faceshield',
        productName: 'Face Shield',
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
          // eslint-disable-next-line no-template-curly-in-string
          artifactName: '${productName} v${version} setup.${ext}',
        },
      },
    },
  },
};
