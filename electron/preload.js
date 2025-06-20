const { contextBridge, ipcRenderer } = require('electron');

// Expone una API segura al renderer
contextBridge.exposeInMainWorld('electron', {
  isElectron: true,
  ipcRenderer: {
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
    on: (channel, listener) => {
      ipcRenderer.on(channel, (event, ...args) => listener(...args));
    },
    removeAllListeners: (channel) => {
      ipcRenderer.removeAllListeners(channel);
    },
  },
  // Expone el módulo de protocolo
  protocol: {
    registerSchemesAsPrivileged: (schemes) => {
      // Esta función se implementa en el proceso principal
      // Aquí solo es un stub para TypeScript
    },
  },
});

// Maneja los mensajes del proceso principal
ipcRenderer.on('message', (event, message) => {
  console.log('Mensaje del proceso principal:', message);
});
