import { EventEmitter } from 'events';
import Kinect from './trackers/kinect';
import Webcam from './trackers/webcam';

export default class TrackerManager extends EventEmitter {
  constructor(options) {
    super();
    this.lastTouches = [];
    this.lastTouchingStatus = false;
    this.trackingActive = false;
    this.previewActive = false;
    this.store = options.store;
    this.tracker = this.store.get('tracker');
    this.initKinect();
    this.initWebcam();
  }

  initKinect() {
    this.kinect = new Kinect();
    this.kinect.on('preview-update', (args) => this.emit('preview-update', args));
    this.kinect.on('skeleton-update', (args) => {
      this.detectTouching([args.head], args.hands, 50,true);
      this.emit('skeleton-update', args);
    });
  }

  initWebcam() {
    this.webcam = new Webcam({
      store: this.store,
    });
    this.webcam.on('data-update', (data) => {
      this.detectTouchingWebcam(data);
      this.emit('webcam-data-update', data)
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

  detectTouching(touchAreas, touchJoints, waitFrames, reverseY = false) {
    let touching = false;
    touchAreas.forEach(touchArea => {
      touchJoints.forEach(touchJoint => {
        if(reverseY) {
          if (
            (touchJoint.x > touchArea.x && touchJoint.x < (touchArea.x + touchArea.dx))
            && (touchJoint.y < touchArea.y && touchJoint.y > (touchArea.y + touchArea.dy))
          ) touching = true;
        } else {
          if (
            (touchJoint.x > touchArea.x && touchJoint.x < (touchArea.x + touchArea.dx))
            && (touchJoint.y > touchArea.y && touchJoint.y < (touchArea.y + touchArea.dy))
          ) touching = true;
        }
      });
    });
    this.lastTouches.push(touching);
    if(this.lastTouches.length > waitFrames) this.lastTouches.shift();
    if(this.lastTouches.filter((touch) => !!touch).length > waitFrames * 0.5) {
      if(!this.lastTouchingStatus && this.trackingActive) {
        const touches = this.store.get('touches')
        touches.push({
          timestamp: Date.now(),
        })
        this.store.set('touches', touches)
        this.emit('ding');
      }
      this.lastTouchingStatus = true;
      this.emit('touching-update', true);
    } else {
      this.lastTouchingStatus = false;
      this.emit('touching-update', false);
    }
  }

  detectTouchingWebcam(data) {
    if(data) {
      const touchAreas = []
      const touchJoints = []
      data.facesBounds.forEach(faceBounds => {
        touchAreas.push({
          x: faceBounds.left,
          y: faceBounds.bottom,
          dx: faceBounds.right - faceBounds.left,
          dy: faceBounds.bottom - faceBounds.top,
        });
      });
      data.hands.forEach((hand) => {
        hand.landmarks.forEach((joint) => {
          touchJoints.push({
            x: joint[0],
            y: joint[1],
          });
        })
      });
      this.detectTouching(touchAreas, touchJoints, 15);
    }
  }
}
