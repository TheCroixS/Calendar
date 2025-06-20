import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Configuración para Electron
if (window.electron) {
  // Configurar el protocolo de archivo para cargar recursos locales
  const { protocol } = window.electron;
  protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
  ]);
}

// Verificar si estamos en un entorno de Electron
const isElectron = window.electron && window.electron.isElectron === true;

// Función para cargar la aplicación
const loadApp = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App isElectron={isElectron} />
    </StrictMode>
  );
};

// Iniciar la aplicación
loadApp();

// Manejar actualizaciones de la aplicación
if (window.electron) {
  window.electron.ipcRenderer.on('update_available', () => {
    console.log('Nueva actualización disponible. Descargando...');
  });

  window.electron.ipcRenderer.on('update_downloaded', () => {
    if (confirm('¡Nueva actualización lista! ¿Deseas reiniciar la aplicación ahora?')) {
      window.electron.ipcRenderer.send('restart_app');
    }
  });
}
