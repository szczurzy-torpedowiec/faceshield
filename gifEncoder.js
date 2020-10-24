const jimp = require('jimp');
const { GifFrame, GifUtil } = require('gifwrap');

process.on('message', async (m) => {
  const filePath = m.path;
  const { frames } = m;
  const gifFrames = await Promise.all(frames.map(async (frame) => {
    const buffer = Buffer.from(frame.data.split(',')[1], 'base64');
    const j = await jimp.read(buffer);
    j.resize(jimp.AUTO, 240);
    return new GifFrame(j.bitmap);
  }));

  GifUtil.quantizeDekker(gifFrames, 32);
  console.log(filePath);
  await GifUtil.write(filePath, gifFrames, { loops: 0 });
  process.send({ filePath });
  process.exit();
});
