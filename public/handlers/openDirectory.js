const { readdir } = require('fs/promises');
const { existsSync } = require('fs');
const os = require('os');
const path = require('path');

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

module.exports = async function (event, ...paths) {
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
            return {
                name: x.name,
                path: filePath,
                extension,
            };
        });

    const directories = entries
        .filter((x) => x.isDirectory())
        .map((x) => x.name)
        .sort();

    return { files, directories, currentPath: finalPath };
};
