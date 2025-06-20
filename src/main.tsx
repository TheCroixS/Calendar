import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Verificar si estamos en un entorno de Electron
const isElectron = !!(window as any).electron && (window as any).electron.isElectron === true;

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

// Manejar actualizaciones de la aplicación (solo en Electron)
if (isElectron && (window as any).electron) {
  const { ipcRenderer } = (window as any).electron;
  
  ipcRenderer.on('update_available', () => {
    console.log('Nueva actualización disponible. Descargando...');
  });

  ipcRenderer.on('update_downloaded', () => {
    if (confirm('¡Nueva actualización lista! ¿Deseas reiniciar la aplicación ahora?')) {
      ipcRenderer.send('restart_app');
    }
  });
}