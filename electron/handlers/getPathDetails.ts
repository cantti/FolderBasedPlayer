const path = require('path');

type PathDetails = {
    path: string;
    name: string;
    extension: string;
};

export default async function getPathDetails(
    event: Electron.IpcMainInvokeEvent,
    givenPath: string
): Promise<PathDetails> {
    return {
        path: givenPath,
        name: path.extname(givenPath),
        extension: path.extname(givenPath).substring(1),
    };
}
