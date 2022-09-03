const { parseFile } = require('music-metadata');

module.exports = async function (event, path) {
    const metadata = await parseFile(path);
    let pictureLink = '';
    if (metadata.common.picture[0]) {
        const picture = metadata.common.picture[0];
        pictureLink = `data:${picture.format};base64,${picture.data.toString('base64')}`;
    }
    return { ...metadata, picture: pictureLink };
};
