const { app, BrowserWindow, session, ipcMain, protocol } = require('electron')
const path = require('path')
const { autoUpdater } = require('electron-updater')

let mainWindow

// Configuración de seguridad
app.commandLine.appendSwitch('disable-http-cache')
app.commandLine.appendSwitch('ignore-certificate-errors')

// Configurar el protocolo personalizado
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: { 
      secure: true, 
      standard: true,
      supportFetchAPI: true,
      stream: true
    }
  }
])

function createWindow() {
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false // Solo para desarrollo, en producción debería ser true
    },
    icon: path.join(__dirname, '../public/icon.ico'),
    show: false // No mostrar hasta que esté listo
  })

  // Cargar la aplicación React
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Manejar el cierre de la aplicación
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// Cuando la aplicación esté lista
app.whenReady().then(() => {
  // Configurar permisos de sesión
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self' 'unsafe-inline' 'unsafe-eval' * data: blob:;"]
      }
    })
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Salir cuando todas las ventanas estén cerradas
autoUpdater.checkForUpdatesAndNotify()

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// Auto Updater
const { autoUpdater } = require('electron-updater')

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
