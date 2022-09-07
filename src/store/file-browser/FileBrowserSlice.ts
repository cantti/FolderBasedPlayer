import { File } from '../../../electron/handlers/openDirectory';

export type FileInBrowser = File & {
    isPlayedInShuffle: boolean;
};

export type FileBrowserSlice = {
    fileBrowser: {
        directories: string[];
        files: FileInBrowser[];
        currentPath: string;
        isReadingMetadata: boolean;

        openDirectory: (...paths: string[]) => void;
        refresh: () => void;
        resetShuffle: () => void;

        _loadMetadata: () => Promise<void>;
    };
};
