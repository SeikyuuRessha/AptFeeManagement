const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (message) => ipcRenderer.send('send-message', message),
    onMessage: (callback) => ipcRenderer.on('message-reply', (event, data) => callback(event, data)),
});
