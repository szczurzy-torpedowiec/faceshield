import { EventEmitter } from 'events';
import { fork } from 'child_process';
import path from 'path';
import Kinect from './trackers/kinect';
import Webcam from './trackers/webcam';

export default class TrackerManager extends EventEmitter {
  constructor(options) {
    super();
    this.lastTouches = [];
    this.imageFrames = [];
    this.lastTouchingStatus = false;
    this.trackingActive = false;
    this.previewActive = false;
    this.store = options.store;
    this.tracker = this.store.get('tracker');
    this.initKinect();
    this.initWebcam();
    this.gifSaveFolder = options.gifSaveFolder;
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
      store: this.store,
    });
    this.webcam.on('data-update', (data) => {
      this.detectTouchingWebcam(data);
      this.emit('webcam-data-update', data);
    });
  }

  async start() {
    if (this.tracker === 'kinect') {
      await this.kinect.connect();
    } else if (this.tracker === 'webcam') {
      await this.webcam.start();
    }
  }

  stop() {
    if (this.tracker === 'kinect') {
      this.kinect.disconnect();
    } else if (this.tracker === 'webcam') {
      this.webcam.stop();
    }
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
    if (this.previewActive) return;
    this.stop();
    this.emit('touching-update', false);
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
    this.lastTouches.push({
      touching,
      timestamp: Date.now(),
    });
    this.lastTouches = this.lastTouches.filter((touchObj) => touchObj.timestamp > Date.now() - 500);
    if (this.lastTouches.filter((touch) => touch.touching).length > this.lastTouches.length * 0.5
      && this.lastTouches.length > 1) {
      if (!this.lastTouchingStatus && this.trackingActive) {
        this.emit('ding');
        this.saveTouch();
      }
      this.lastTouchingStatus = true;
      this.emit('touching-update', true);
    } else {
      this.lastTouchingStatus = false;
      this.emit('touching-update', false);
    }
  }

  detectTouchingKinect(skeleton) {
    let touching = false;
    skeleton.hands.forEach((hand) => {
      if (
        (hand.x >= skeleton.head.x && hand.x <= (skeleton.head.x + skeleton.head.dx))
        && (hand.y <= skeleton.head.y && hand.y >= (skeleton.head.y + skeleton.head.dy))
      ) touching = true;
    });
    this.handleTouching(touching, 50);
  }

  detectTouchingWebcam(data) {
    if (!data) return;
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
    this.imageFrames = this.imageFrames.filter((frame) => frame.timestamp > Date.now() - 10000);
    this.imageFrames.push({
      timestamp: Date.now(),
      data,
    });
  }

  saveTouch() {
    // TODO: Nagrywanie włączone
    if (true) {
      setTimeout(async () => {
        const frames = this.imageFrames.filter((frame) => frame.timestamp > Date.now() - 5000);
        const encoderProcess = fork('./gifEncoder.js');
        const gifSavePath = path.join(this.gifSaveFolder, `${Date.now()}.gif`);
        encoderProcess.send({
          frames,
          path: gifSavePath,
        });
        encoderProcess.on('message', (m) => {
          const touches = this.store.get('touches');
          touches.push({
            timestamp: Date.now(),
            gifPath: m.filePath,
          });
          this.store.set('touches', touches);
        });
      }, 1500);
    } else {
      const touches = this.store.get('touches');
      touches.push({
        timestamp: Date.now(),
        gifPath: null,
      });
      this.store.set('touches', touches);
    }
  }
}
