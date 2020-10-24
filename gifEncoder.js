const jimp = require("jimp");
const {GifFrame, GifUtil} = require('gifwrap');
const fs = require('fs');

process.on('message', (m) => {
  setTimeout(async () => {
    const imageFrames = m.imageFrames;
    const frames = imageFrames.filter((frame) => frame.timestamp > Date.now() - 5000);
    const gifFrames = []
    for (let i = 0; i < frames.length; i++) {
      const buffer = Buffer.from(frames[i].data.split(',')[1], 'base64');
      const j = await jimp.read(buffer)
      j.resize(320, jimp.AUTO);
      gifFrames.push(new GifFrame(j.bitmap));
      if (!frames[i + 1]) {
        GifUtil.quantizeDekker(gifFrames, 32)
        if(!fs.existsSync(`${m.path}/recordings/`)) {
          fs.mkdirSync(`${m.path}/recordings/`);
        }
        GifUtil.write(`${m.path}/recordings/${Date.now()}.gif`, gifFrames, {loops: 0}).then(() => {
          process.exit();
        });
      }
    }
  });
});
