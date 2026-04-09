// Preload script: runs in renderer context before page loads.
// Exposes safe Node/Electron APIs to the renderer via contextBridge if needed.
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
});
