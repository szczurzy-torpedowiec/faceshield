import { EventEmitter } from 'events';
import path from 'path';
import { GifFrame, GifUtil } from 'gifwrap';
import jimp from 'jimp';
import fs from 'fs';
import Kinect from './trackers/kinect';
import Webcam from './trackers/webcam';

export default class TrackerManager extends EventEmitter {
  constructor(options) {
    super();
    this.configStore = options.configStore;
    this.gifSaveFolder = options.gifSaveFolder;
    this.trackingStore = options.trackingStore;
    this.imageFrames = [];
    this.trackingActive = false;
    this.previewActive = false;
    this.faceDetectStreak = 0;
    this.touchStreak = 0;
    this.touching = false;
    this.touchEvent = null;
    this.state = null;
    this.loaded = false;
    this.faceDetected = false;

    this.checkLastActiveTime();
    setInterval(() => this.checkLastActiveTime(), 1000);

    this.tracker = this.configStore.get('tracker');
    this.initKinect();
    this.initWebcam();

    this.configStore.onDidChange('videoInputLabel', (label) => {
      this.webcam.setVideoInputLabel(label);
    });
    this.configStore.onDidChange('useCpuBackend', (useCpuBackend) => {
      this.webcam.setUseCpuBackend(useCpuBackend);
    });
    this.configStore.onDidChange('webcamFrameWait', (wait) => {
      this.webcam.setFrameWait(wait);
    });
    this.configStore.onDidChange('tracker', async (tracker) => {
      await this.setTracker(tracker);
    });
  }

  updateState() {
    const oldState = this.state;
    if (!this.trackingActive && !this.previewActive) this.state = null;
    else if (this.tracker === 'webcam' && this.webcam.anyError) this.state = 'tracker-error';
    else if (!this.loaded) this.state = 'tracker-loading';
    else if (!this.faceDetected) this.state = 'face-not-detected';
    else if (this.touching) this.state = 'touching';
    else this.state = 'not-touching';

    if (this.state === oldState) return;
    this.emit('state-update', this.state);
  }

  checkLastActiveTime() {
    const lastActiveTime = this.trackingStore.get('lastActiveTime');
    if (lastActiveTime === null) return;
    const timeSinceEnd = new Date().getTime() - lastActiveTime.endTimestamp;
    if (timeSinceEnd < 10000) return;
    this.trackingStore.set('lastActiveTime', null);

    const duration = lastActiveTime.endTimestamp - lastActiveTime.startTimestamp;
    if (duration >= 10000) {
      const activeTimes = this.trackingStore.get('activeTimes');
      activeTimes.push({
        ...lastActiveTime,
        duration,
      });
      this.trackingStore.set('activeTimes', activeTimes);
    }
  }

  updateActiveTime(detected) {
    if (!detected || !this.trackingActive) {
      this.faceDetectStreak = 0;
      return;
    }
    this.faceDetectStreak += 1;
    if (this.faceDetectStreak < 3) return;

    const lastActiveTime = this.trackingStore.get('lastActiveTime');
    const endTimestamp = new Date().getTime();
    if (lastActiveTime === null) {
      this.trackingStore.set('lastActiveTime', {
        startTimestamp: endTimestamp,
        endTimestamp,
      });
    } else this.trackingStore.set('lastActiveTime.endTimestamp', endTimestamp);
  }

  initKinect() {
    this.kinect = new Kinect();
    this.kinect.on('preview-update', (data) => {
      this.saveFrame(data);
      this.emit('preview-update', data);
    });
    this.kinect.on('skeleton-update', (skeleton) => {
      this.detectTouchingKinect(skeleton);
      this.emit('skeleton-update', skeleton);
    });
  }

  initWebcam() {
    this.webcam = new Webcam({
      configStore: this.configStore,
    });
    this.webcam.on('data-update', (data) => {
      this.detectTouchingWebcam(data);
      this.emit('webcam-data-update', data);
    });
    this.webcam.on('any-error', () => { this.updateState(); });
  }

  async start() {
    this.loaded = false;
    if (this.tracker === 'kinect') {
      await this.kinect.connect();
    } else if (this.tracker === 'webcam') {
      await this.webcam.start();
    }
    this.updateState();
  }

  stop() {
    this.loaded = false;
    this.touching = false;
    this.faceDetected = false;
    this.emit('touching-update', false);
    if (this.tracker === 'kinect') {
      this.kinect.disconnect();
    } else if (this.tracker === 'webcam') {
      this.webcam.stop();
    }
    this.updateState();
  }

  async startTracking() {
    if (this.trackingActive) return;
    this.trackingActive = true;
    if (this.previewActive) return;
    await this.start();
  }

  stopTracking() {
    if (!this.trackingActive) return;
    this.trackingActive = false;
    this.touchEvent = null;
    this.emit('touch-event-update', false);
    this.updateActiveTime(false);
    if (this.previewActive) return;
    this.stop();
  }

  async startPreview() {
    if (this.previewActive) return;
    this.previewActive = true;
    if (this.trackingActive) return;
    await this.start();
  }

  stopPreview() {
    if (!this.previewActive) return;
    this.previewActive = false;
    if (this.trackingActive) return;
    this.stop();
  }

  async setTracker(tracker) {
    if (!(this.trackingActive || this.previewActive)) {
      this.tracker = tracker;
      return;
    }
    const currentTracker = this.tracker;
    if (tracker === currentTracker) return;
    this.stop();
    this.tracker = tracker;
    await this.start();
  }

  handleTouching(touching) {
    if (touching) {
      this.touchStreak += 1;
    } else {
      this.touchStreak = 0;
    }
    this.touching = touching;
    this.emit('touching-update', touching);

    if (!this.trackingActive) return;

    if (this.touchStreak >= 3) {
      this.emit('touch-event-update', true);
      if (this.touchEvent === null) {
        this.emit('ding');
        this.touchEvent = {
          start: new Date(),
          end: new Date(),
        };
      } else {
        this.touchEvent.end = new Date();
      }
    } else if (this.touchEvent === null) {
      this.emit('touch-event-update', false);
    } else if (this.touchEvent.end < new Date() - 3000) {
      this.emit('touch-event-update', false);
      this.saveTouch(this.touchEvent.start.getTime());
      this.touchEvent = null;
    }

    this.updateState();
  }

  detectTouchingKinect(skeleton) {
    this.loaded = true;
    let touching = false;
    if (skeleton.head) {
      this.updateActiveTime(true);
      skeleton.hands.forEach((hand) => {
        if (
          (hand.x >= skeleton.head.x && hand.x <= (skeleton.head.x + skeleton.head.dx))
            && (hand.y <= skeleton.head.y && hand.y >= (skeleton.head.y + skeleton.head.dy))
        ) touching = true;
      });
    }

    this.faceDetected = !!skeleton.head;
    this.updateActiveTime(this.faceDetected);
    this.handleTouching(touching, 50);
  }

  detectTouchingWebcam(data) {
    if (!data) {
      this.faceDetected = false;
      this.loaded = false;
      this.handleTouching(false);
      this.updateActiveTime(false);
      this.updateState();
      return;
    }
    this.loaded = true;

    this.faceDetected = data.facesBounds.length > 0;
    this.updateActiveTime(this.faceDetected);
    this.saveFrame(data.image);

    const touchJoints = data.hands.flatMap((hand) => hand.landmarks);
    let touching = false;
    data.facesBounds.forEach(({
      top, bottom, left, right,
    }) => {
      touchJoints.forEach(([x, y]) => {
        if ((x >= left && x <= right) && (y >= top && y <= bottom)) touching = true;
      });
    });
    this.handleTouching(touching, 5);
  }

  saveFrame(data) {
    if (this.touchEvent === null) {
      this.imageFrames = this.imageFrames.filter((frame) => frame.timestamp > Date.now() - 10000);
    }
    this.imageFrames.push({
      timestamp: Date.now(),
      data,
    });
  }

  async saveGif(timestamp) {
    const frames = this.imageFrames.filter((frame) => frame.timestamp > timestamp - 3000);
    if (frames.length === 0) return null;
    const gifFrames = await Promise.all(frames.map(async (frame) => {
      const buffer = Buffer.from(frame.data.split(',')[1], 'base64');
      const j = await jimp.read(buffer);
      j.resize(jimp.AUTO, 240);
      return new GifFrame(j.bitmap);
    }));

    GifUtil.quantizeDekker(gifFrames, 32);
    try {
      await fs.promises.mkdir(this.gifSaveFolder);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
    const filePath = path.join(this.gifSaveFolder, `${timestamp}.gif`);
    await GifUtil.write(filePath, gifFrames, { loops: 0 });
    return filePath;
  }

  async saveTouch(timestamp) {
    let filePath = null;
    if (this.configStore.get('saveGifs')) {
      filePath = (await this.saveGif(timestamp)).toString();
    }
    const touches = this.trackingStore.get('touches');
    touches.push({
      timestamp,
      gifPath: filePath,
    });
    this.trackingStore.set('touches', touches);
  }
}
