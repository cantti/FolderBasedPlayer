// see https://github.com/kitze/react-electron-example/blob/master/public/electron.js
const { app, ipcMain, dialog, BrowserWindow, protocol } = require("electron");
const { join } = require("path");
const isDev = require("electron-is-dev");
const registerHandlers = require("./registerHandlers");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${join(__dirname, "../build/index.html")}`
  );

  mainWindow.openDevTools({ mode: "detach" });

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", () => {
  createWindow();

  // https://github.com/electron/electron/issues/23393
  protocol.registerFileProtocol("atom", (request, callback) => {
    const url = request.url.substring(7);
    callback({ path: url });
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

registerHandlers();

// https://gist.github.com/whoisryosuke/ab0ee89e878c48947fe7fd8eedb8431f
