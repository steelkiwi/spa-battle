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

  if (process.env.NODE_ENV === 'development') {
    console.info('Electron dev mode enabled');
    win.webContents.openDevTools();

    const chokidar = require('chokidar');
    const debounce = require('debounce');
    chokidar.watch(__dirname).on('change', debounce(() => {
      const currentLocation = win.webContents.getURL()
      const currentRoute = currentLocation.slice(currentLocation.indexOf('#'));
      win.loadURL(`file://${__dirname}/index.html${currentRoute}`);
    }, 1000));
  }

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
