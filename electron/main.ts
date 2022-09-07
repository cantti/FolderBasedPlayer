import { app, BrowserWindow, protocol, ipcMain, dialog } from 'electron';
import * as path from 'path';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import openDirectory from './handlers/openDirectory';
import readMetadata from './handlers/readMetadata';
import getPathDetails from './handlers/getPathDetails';

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            // contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    if (app.isPackaged) {
        // 'build/index.html'
        win.loadURL(`file://${__dirname}/../index.html`);
    } else {
        win.loadURL('http://localhost:3000/index.html');

        win.webContents.openDevTools({ mode: 'detach' });

        // Hot Reloading on 'node_modules/.bin/electronPath'
        require('electron-reload')(__dirname, {
            electron: path.join(
                __dirname,
                '..',
                '..',
                'node_modules',
                '.bin',
                'electron' + (process.platform === 'win32' ? '.cmd' : '')
            ),
            forceHardReset: true,
            hardResetMethod: 'exit',
        });
    }

    ipcMain.handle('openDirectory', openDirectory);
    ipcMain.handle('readMetadata', readMetadata);
    ipcMain.handle('getPathDetails', getPathDetails);
}

app.whenReady().then(() => {
    // DevTools
    // installExtension(REACT_DEVELOPER_TOOLS)
    //     .then((name) => console.log(`Added Extension:  ${name}`))
    //     .catch((err) => console.log('An error occurred: ', err));

    createWindow();

    protocol.registerFileProtocol('atom', (request, callback) => {
        const url = decodeURI(request.url.substring(7));
        callback({ path: url });
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
});

ipcMain.handle('openFile', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
    });

    const path = result.filePaths[0];

    return path;
});
