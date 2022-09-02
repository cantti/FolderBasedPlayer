const { parseFile } = require('music-metadata');

module.exports = async function (event, path) {
    const metadata = await parseFile(path);
    return metadata;
};
