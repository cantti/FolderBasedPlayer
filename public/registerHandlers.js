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

  ipcMain.handle("getDefaultDirectory", () => {
    return os.homedir();
  });

  ipcMain.handle("openDirectory", async (event, ...paths) => {
    if (paths.length === 0) {
      paths = [os.homedir()];
    }

    const finalPath = path.normalize(path.join(...paths));

    const entries = (
      await fs.readdir(finalPath, { withFileTypes: true })
    ).filter((x) => x.name[0] !== ".");

    const files = entries
      .filter((x) => !x.isDirectory())
      .map((x) => x.name)
      .sort();

    const directories = [
      "..",
      ...entries
        .filter((x) => x.isDirectory())
        .map((x) => x.name)
        .sort(),
    ];

    return { files, directories, currentPath: finalPath };
  });
}

module.exports = registerHandlers;
