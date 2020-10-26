import fs from 'fs';
import jimp from 'jimp';
import path from 'path';
import { GifFrame, GifUtil } from 'gifwrap';

process.on('message', async ({ frames, timestamp, folder }) => {
  const gifFrames = await Promise.all(frames.map(async (frame) => {
    const buffer = Buffer.from(frame.data.split(',')[1], 'base64');
    const j = await jimp.read(buffer);
    j.resize(jimp.AUTO, 240);
    return new GifFrame(j.bitmap);
  }));

  GifUtil.quantizeDekker(gifFrames, 32);
  try {
    await fs.promises.mkdir(folder);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }
  const filePath = path.join(folder, `${timestamp}.gif`);
  await GifUtil.write(filePath, gifFrames, { loops: 0 });

  process.send({
    filePath,
  });
  process.exit();
});
