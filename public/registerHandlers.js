const { ipcMain, dialog } = require("electron");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");


function registerHandlers() {
  ipcMain.handle("openFile", async () => {
    const result = await dialog.showOpenDialog({ properties: ["openFile"] });

    const path = result.filePaths[0];

    return path;
  });

  ipcMain.handle("openDirectory", require("./handlers/openDirectory"));
  ipcMain.handle("readMetadata", require("./handlers/readMetadata"));
}

module.exports = registerHandlers;
