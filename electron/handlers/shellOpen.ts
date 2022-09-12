import { shell } from 'electron';

export default function shellOpen(event: Electron.IpcMainInvokeEvent, url: string) {
    shell.openExternal(url);
}
