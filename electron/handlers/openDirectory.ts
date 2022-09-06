import { readdir } from 'fs/promises';
import { existsSync } from 'fs';
import os = require('os');
import path = require('path');
import { IAudioMetadata } from 'music-metadata';

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
    picture: string;
    metadata?: IAudioMetadata;
    isMetadataLoaded: boolean;
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
    let finalPath = os.homedir();

    if (paths.length !== 0 && paths[0] !== '') {
        const tmpPath = path.resolve(path.join(...paths));
        if (existsSync(finalPath)) {
            finalPath = tmpPath;
        }
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
                isMetadataLoaded: false,
                metadata: undefined,
                picture: '',
            };
            return file;
        });

    const directories = entries
        .filter((x) => x.isDirectory())
        .map((x) => x.name)
        .sort();

    return { files, directories, currentPath: finalPath };
}
