import configStore from './stores/config';

export default class OverlayCommunication {
  setTouching(win, touching) {
    const alertsEnabled = configStore.get('overlayAlertsEnabled');
    win.webContents.send('overlay:set-touching', touching && alertsEnabled);
  }

  ding(win) {
    const volume = configStore.get('alertVolume');
    if (volume === 0) return;
    win.webContents.send('overlay:ding', { volume });
  }
}
