const { readdir } = require('fs/promises');
const { existsSync } = require('fs');
const os = require('os');
const path = require('path');

module.exports = async function (event, ...paths) {
    let finalPath = path.resolve(path.join(...paths));

    if (!existsSync(finalPath)) {
        finalPath = os.homedir();
    }

    const entries = (
        await readdir(finalPath, { withFileTypes: true })
    ).filter((x) => x.name[0] !== '.');

    const files = entries
        .filter((x) => !x.isDirectory())
        .filter((x) => path.extname(x.name).toLowerCase() === '.mp3')
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
