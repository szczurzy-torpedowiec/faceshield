import { EventEmitter } from 'events';
import Kinect from './trackers/kinect';
import Webcam from './trackers/webcam';

export default class TrackerManager extends EventEmitter {
  constructor(options) {
    super();
    this.active = false;
    this.store = options.store;
    this.tracker = this.store.get('tracker');
    this.initKinect();
    this.initWebcam();
  }

  initKinect() {
    this.kinect = new Kinect();
    this.kinect.on('preview-update', (args) => {
      this.emit('preview-update', args);
    });
    this.kinect.on('skeleton-update', (args) => {
      this.emit('skeleton-update', args);
    });
  }

  initWebcam() {
    this.webcam = new Webcam({
      store: this.store,
    });
    this.webcam.on('data-update', (data) => this.emit('webcam-data-update', data));
  }

  async start() {
    this.active = true;
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
    this.active = false;
  }

  async setTracker(tracker) {
    if (!this.active) {
      this.tracker = tracker;
      return;
    }
    const currentTracker = this.tracker;
    if (tracker === currentTracker) return;
    this.stop();
    this.tracker = tracker;
    await this.start();
  }
}
