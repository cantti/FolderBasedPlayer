import { IAudioMetadata, parseFile } from 'music-metadata';
import { readdir } from 'fs/promises';
import { readFileSync } from 'fs';
import { dirname, join, extname } from 'path';
const mime = require('mime');

export type Metadata = IAudioMetadata & {
    picture: string;
};

export default async function readMetadata(
    event: Electron.IpcMainInvokeEvent,
    path: string
): Promise<Metadata> {
    const metadata = await parseFile(path);

    let pictureLink = '';
    if (metadata.common.picture![0]) {
        const picture = metadata.common.picture![0];
        pictureLink = `data:${picture.format};base64,${picture.data.toString('base64')}`;
    } else {
        const dirName = dirname(path);
        let name = (await readdir(dirName, { withFileTypes: true }))
            .filter((x) => x.isFile())
            .find((x) => x.name.startsWith('cover') || x.name.startsWith('folder'))?.name;
        if (name) {
            const imagePath = join(dirName, name);
            const extension = extname(imagePath).substring(1);
            const mimeType = mime.getType(extension);
            const base64 = readFileSync(imagePath, {
                encoding: 'base64',
            });
            pictureLink = `data:${mimeType};base64,${base64}`;
        }
    }
    return { ...metadata, picture: pictureLink };
}
