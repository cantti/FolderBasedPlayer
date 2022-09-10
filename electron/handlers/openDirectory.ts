import { readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { IAudioMetadata } from 'music-metadata';
import { extname, join, resolve } from 'path';
import { homedir } from 'os';

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
    picture: string;
    metadata?: IAudioMetadata;
    isMetadataLoaded: boolean;
};

export type Directory = {
    name: string;
    path: string;
};

export type DirectoryContent = {
    files: File[];
    directories: Directory[];
    currentPath: string;
};

export default async function openDirectory(
    event: Electron.IpcMainInvokeEvent,
    path: string,
    recursively: boolean
): Promise<DirectoryContent> {
    path = resolve(path);

    path = existsSync(path) ? path : homedir();

    const entries = (await readdir(path, { withFileTypes: true })).filter((x) => x.name[0] !== '.');

    let files = entries
        .filter((x) => !x.isDirectory())
        .filter((x) => supportedExtensions.includes(extname(x.name).toLowerCase()))
        .map((x) => {
            const filePath = join(path, x.name);
            const file: File = {
                name: x.name,
                path: filePath,
                isMetadataLoaded: false,
                metadata: undefined,
                picture: '',
            };
            return file;
        });

    const directories: Directory[] = entries
        .filter((x) => x.isDirectory())
        .map((x) => ({ name: x.name, path: join(path, x.name) }));

    if (recursively) {
        for (const directory of directories) {
            const content = await openDirectory(event, directory.path, true);
            files.push(...content.files);
        }
    }

    return { files, directories, currentPath: path };
}
