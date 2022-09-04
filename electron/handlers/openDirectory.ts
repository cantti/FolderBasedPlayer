import { readdir } from 'fs/promises';
import { existsSync } from 'fs';
import os = require('os');
import path = require('path');

const supportedExtensions = [
    '.mp3',
    '.mpeg',
    '.opus',
    '.ogg',
    '.oga',
    '.wav',
    '.aac',
    '.caf',
    '.m4a',
    '.m4b',
    '.mp4',
    '.weba',
    '.webm',
    '.dolby',
    '.flac',
];

export type File = {
    name: string;
    path: string;
    extension: string;
};

export type DirectoryContent = {
    files: File[];
    directories: string[];
    currentPath: string;
};

export default async function openDirectory(
    event: Electron.IpcMainInvokeEvent,
    ...paths: string[]
): Promise<DirectoryContent> {
    let finalPath = path.resolve(path.join(...paths));

    if (!existsSync(finalPath)) {
        finalPath = os.homedir();
    }

    const entries = (await readdir(finalPath, { withFileTypes: true })).filter(
        (x) => x.name[0] !== '.'
    );

    const files = entries
        .filter((x) => !x.isDirectory())
        .filter((x) => supportedExtensions.includes(path.extname(x.name).toLowerCase()))
        .map((x) => {
            const filePath = path.join(finalPath, x.name);
            const extension = path.extname(filePath).substring(1);
            const file: File = {
                name: x.name,
                path: filePath,
                extension,
            };
            return file;
        });

    const directories = entries
        .filter((x) => x.isDirectory())
        .map((x) => x.name)
        .sort();

    return { files, directories, currentPath: finalPath };
}
