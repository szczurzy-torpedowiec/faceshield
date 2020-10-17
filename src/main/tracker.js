import { EventEmitter } from 'events';
import Kinect from './trackers/kinect';

export default class Tracker extends EventEmitter {
  constructor(tracker) {
    super();
    if (tracker === 'kinect') {
      const kinect = new Kinect();
      this.connect = kinect.connect;
      this.disconnect = kinect.disconnect;
      kinect.on('preview-update', (args) => {
        this.emit('preview-update', args);
      });
    }
  }
}
