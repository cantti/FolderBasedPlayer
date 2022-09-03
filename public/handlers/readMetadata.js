const { parseFile } = require('music-metadata');

module.exports = async function (event, path) {
    const metadata = await parseFile(path);
    let pictureBase64 = '';
    if (metadata.common.picture[0]) {
        const picture = metadata.common.picture[0];
        pictureBase64 = `data:${picture.format};base64,${picture.data.toString('base64')}`;
    }
    return { ...metadata, picture: pictureBase64 };
};
