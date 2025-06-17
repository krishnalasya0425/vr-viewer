const { app, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');
const server = express();

// Serve the frontend
server.use(express.static(path.join(__dirname, '../frontend/dist')));

// Start the server
const PORT = 3000;
let serverInstance;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`https://localhost:${PORT}`);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  serverInstance = server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    createWindow();
  });

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  if (serverInstance) {
    serverInstance.close();
  }
});