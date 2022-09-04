const { parseFile } = require('music-metadata');
const { readdir } = require('fs/promises');
const { readFileSync } = require('fs');
const { dirname, join, extname } = require('path');
const mime = require('mime')

module.exports = async function (event, path) {
    const metadata = await parseFile(path);
    let pictureLink = '';
    if (metadata.common.picture[0]) {
        const picture = metadata.common.picture[0];
        pictureLink = `data:${picture.format};base64,${picture.data.toString('base64')}`;
    } else {
        const dirName = dirname(path);
        let name = (await readdir(dirName, { withFileTypes: true }))
            .filter((x) => x.isFile())
            .find((x) => x.name.startsWith('cover') || x.name.startsWith('folder'))?.name;
        if (name) {
            const imagePath = join(dirName, name);
            const extension = extname(imagePath).substring(1)
            const mimeType = mime.getType(extension);
            const base64 = readFileSync(imagePath, {
                encoding: 'base64',
            });
            pictureLink = `data:${mimeType};base64,${base64}`;
        }
    }
    return { ...metadata, picture: pictureLink };
};
