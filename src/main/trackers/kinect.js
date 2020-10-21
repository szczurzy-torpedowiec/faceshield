import getPort from 'get-port';
import { spawn } from 'child_process';
import { EventEmitter } from 'events';

const WebSocketClient = require('websocket').client;

export default class Kinect extends EventEmitter {
  async connect() {
    let executed = false;
    const modulePath = process.env.WEBPACK_DEV_SERVER_URL
      ? './modules/FaceShieldKinectModule/FaceShieldKinectModule/bin/Release/FaceShieldKinectModule.exe'
      : './modules/FaceShieldKinectModule/FaceShieldKinectModule.exe';
    // TODO: Sprawdzanie, czy plik modułu istnieje
    const port = await getPort();
    this.moduleProcess = spawn(modulePath, [port.toString()]);
    this.moduleProcess.stdout.on('data', () => {
      if (!executed) {
        executed = true;
        const client = new WebSocketClient();
        client.on('connect', (connection) => {
          this.emit('connected');
          connection.on('message', (message) => {
            const msg = JSON.parse(message.utf8Data);
            if (msg.type === 'image') {
              this.emit('preview-update', msg.data);
            }
            if (msg.type === 'skeleton') {
              const skeletonJson = JSON.parse(msg.data);
              this.emit('skeleton-update', skeletonJson);
            }
          });
        });
        client.connect(`ws://localhost:${port}`);
      }
    });
  }

  disconnect() {
    if (this.moduleProcess) this.moduleProcess.kill();
  }
}
