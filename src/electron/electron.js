// src/electron/electron.js

const { app, BrowserWindow } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow();
  win.maximize();

  win.loadURL(`http://localhost:4200`);

  win.on('closed', () => {
    win = null;
  });
};

app.on('ready', createWindow);

app.on('activate', () => {
  if (!win) {
    createWindow();
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
