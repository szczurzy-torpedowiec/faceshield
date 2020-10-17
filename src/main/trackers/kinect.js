import getPort from 'get-port';
import { spawn } from 'child_process';
import { EventEmitter } from 'events';

const WebSocketClient = require('websocket').client;

function jsonValid(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export default class Kinect extends EventEmitter {
  async connect() {
    let executed = false;
    const modulePath = 'C:\\Users\\doteq\\Documents\\FaceShieldKinectModule\\FaceShieldKinectModule.exe';
    // TODO: Sprawdzanie, czy plik modułu istnieje
    const port = await getPort();
    debugger;
    this.moduleProcess = spawn(modulePath, [port.toString()]);
    this.moduleProcess.stdout.on('data', () => {
      if (!executed) {
        executed = true;
        const client = new WebSocketClient();
        client.on('connect', (connection) => {
          this.emit('connected');
          connection.on('message', (message) => {
            if (message.type === 'utf8') {
              const data = message.utf8Data;
              if (jsonValid(data)) {
                // skeleton
                const skeleton = JSON.parse(data);
                debugger;
              } else {
                this.emit('preview-update', data);
              }
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
