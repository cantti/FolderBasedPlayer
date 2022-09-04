const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    openFile: () => ipcRenderer.invoke('openFile'),
    openDirectory: (...paths: string[]) => ipcRenderer.invoke('openDirectory', ...paths),
    readMetadata: (path: string) => ipcRenderer.invoke('readMetadata', path),
    getPathDetails: (path: string) => ipcRenderer.invoke('getPathDetails', path),
});
