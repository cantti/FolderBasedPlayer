import { Directory } from '../../../electron/handlers/openDirectory';
import { FileInPlayer } from '../FileInPlayer';

export type DirectoryInPlayer = Directory & {
    id: string;
};

export type FileBrowserSlice = {
    fileBrowser: {
        directories: DirectoryInPlayer[];
        files: FileInPlayer[];
        currentPath: string;
        isReadingMetadata: boolean;

        openDirectory: (...paths: string[]) => void;
        refresh: () => void;
        resetShuffle: () => void;

        _loadMetadata: () => Promise<void>;
    };
};
