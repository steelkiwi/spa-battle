// src/electron/electron.js

const { app, BrowserWindow, session } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow();
  win.maximize();

  win.loadURL(`file://${__dirname}/index.html`);
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ['https://*.gateway.marvel.com/*'] },
    (details, callback) => {
      details.requestHeaders['Referer'] = 'https://steelkiwi.github.io';
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    });

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
