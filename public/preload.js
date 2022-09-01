const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  openFile: () => ipcRenderer.invoke("openFile"),
  openDirectory: (...paths) => ipcRenderer.invoke("openDirectory", ...paths),
  readMetadata: (path) => ipcRenderer.invoke("readMetadata", path),
  getPathDetails: (path) => ipcRenderer.invoke("getPathDetails", path),
});