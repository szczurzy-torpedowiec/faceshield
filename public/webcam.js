console.log('Importing dependencies...');

const { ipcRenderer } = require('electron');

ipcRenderer.send('webcam:data', null);

const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');
const handtrack = require('@tensorflow-models/handpose');
const tf = require('@tensorflow/tfjs-core');
require('@tensorflow/tfjs-backend-webgl');
require('@tensorflow/tfjs-backend-cpu');

console.log('Imported dependencies');

let faceModel;
let handsModel;

let video;
let canvas;
let ctx;
let stream = null;
let frameWait = 0;

function waitForPromiseFinish(promise) {
  return new Promise((resolve) => {
    promise.then(() => resolve()).finally(() => resolve());
  });
}

function waitForDataLoaded() {
  return new Promise((resolve) => {
    if (video.readyState >= 2) { // 2 - HAVE_CURRENT_DATA
      resolve();
    } else {
      video.addEventListener('loadeddata', resolve, { once: true });
    }
  });
}

function assignElements() {
  video = document.getElementById('video');
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
}

async function execute() {
  await waitForDataLoaded();
  if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth;
  if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const image = canvas.toDataURL('image/jpeg');
  const [faces, hands] = await Promise.all([
    faceModel.estimateFaces({ input: video }),
    handsModel.estimateHands(video),
  ]);

  const facesBounds = faces.map((face) => {
    let left = canvas.width;
    let right = 0;
    let top = canvas.height;
    let bottom = 0;

    face.scaledMesh.forEach(([x, y]) => {
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    });

    // const width = right - left;
    // const height = bottom - top;
    // ctx.strokeWidth = 8;
    // ctx.strokeStyle = '#FF00FF';
    // ctx.strokeRect(left, top, width, height);
    // const centerX = left + width / 2;
    // const centerY = top + height / 2;
    //
    // let maxRadius2 = 0;
    //
    // face.scaledMesh.forEach(([x, y]) => {
    //   const radius2 = (x - centerX) ** 2 + (y - centerY) ** 2;
    //   if (radius2 > maxRadius2) maxRadius2 = radius2;
    // });
    //
    // ctx.beginPath();
    // ctx.arc(left + width / 2, top + height / 2, Math.sqrt(maxRadius2), 0, 2 * Math.PI);
    // ctx.stroke();

    return {
      left, right, top, bottom,
    };
  });
  // hands.forEach((hand) => {
  //   hand.landmarks.forEach(([x, y]) => {
  //     ctx.fillStyle = '#00FF00';
  //     ctx.beginPath();
  //     ctx.arc(x, y, 4, 0, 2 * Math.PI);
  //     ctx.fill();
  //   });
  // });
  ipcRenderer.send('webcam:data', {
    image,
    width: video.videoWidth,
    height: video.videoHeight,
    facesBounds,
    hands: hands.map((hand) => ({
      landmarks: hand.landmarks,
    })),
  });
  setTimeout(execute, frameWait);
}

async function loadModels() {
  try {
    faceModel = await faceLandmarksDetection.load();
    handsModel = await handtrack.load();
    ipcRenderer.send('webcam:models-loading-error', true);
  } catch (error) {
    console.error(error);
    await new Promise((resolve) => {
      setTimeout(async () => {
        await loadModels();
        resolve();
      }, 5000);
    });
  }

  ipcRenderer.send('webcam:models-loading-error', false);
}

let getUserMediaPromise = null;
let setDeviceTimeoutId = null;

async function setDevice(deviceId) {
  ipcRenderer.send('webcam:data', null);
  if (setDeviceTimeoutId !== null) clearTimeout(setDeviceTimeoutId);
  if (getUserMediaPromise !== null) await waitForPromiseFinish(getUserMediaPromise);

  if (stream !== null) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
    stream = null;
  }
  video.srcObject = null;
  getUserMediaPromise = navigator.mediaDevices.getUserMedia({
    video: {
      deviceId: deviceId === null ? null : { exact: deviceId },
      facingMode: 'user',
    },
  });
  try {
    stream = await getUserMediaPromise;
    video.srcObject = stream;
    ipcRenderer.send('webcam:camera-loading-error', false);
  } catch (error) {
    console.error(error);
    ipcRenderer.send('webcam:camera-loading-error', true);
    setDeviceTimeoutId = setTimeout(() => {
      setDeviceTimeoutId = null;
      setDevice(deviceId);
    }, 5000);
  } finally {
    getUserMediaPromise = null;
  }
}

async function main() {
  assignElements();

  ipcRenderer.on('webcam:input-device-id-changed', async (event, deviceId) => {
    await setDevice(deviceId);
  });
  ipcRenderer.on('webcam:use-cpu-backend-changed', async (event, useCpuBackend) => {
    await tf.setBackend(useCpuBackend ? 'cpu' : 'webgl');
  });
  ipcRenderer.on('webcam:frame-wait-changed', async (event, wait) => {
    frameWait = wait;
  });

  console.log('Loading backend...');
  const useCpuBackend = await ipcRenderer.invoke('webcam:get-use-cpu-backend');
  await tf.setBackend(useCpuBackend ? 'cpu' : 'webgl');

  console.log('Loading models...');
  await loadModels();
  console.log('Settings device...');

  const deviceId = await ipcRenderer.invoke('webcam:get-input-device-id');
  await setDevice(deviceId);
  console.log('Set device');

  frameWait = await ipcRenderer.invoke('webcam:get-frame-wait');

  await execute();
}

main();
