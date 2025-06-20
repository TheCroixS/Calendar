// Tipos para la API de Electron expuesta en el preload
declare global {
  interface Window {
    electron: {
      isElectron: boolean;
      ipcRenderer: {
        send(channel: string, ...args: any[]): void;
        on(channel: string, listener: (...args: any[]) => void): void;
        removeAllListeners(channel: string): void;
      };
      protocol: {
        registerSchemesAsPrivileged(schemes: Array<{
          scheme: string;
          privileges: {
            standard?: boolean;
            secure?: boolean;
            bypassCSP?: boolean;
            allowServiceWorkers?: boolean;
            supportFetchAPI?: boolean;
            corsEnabled?: boolean;
            stream?: boolean;
          };
        }>): void;
      };
    };
  }
}
