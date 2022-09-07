import { File } from '../../../electron/handlers/openDirectory';

export type FileInBrowser = File & {
    isPlayedInShuffle: boolean;
};

export type FileBrowserSlice = {
    fileBrowser: {
        directories: string[];
        files: FileInBrowser[];
        currentPath: string;
        selectedFile?: FileInBrowser;
        selectedDirectory: string;
        isReadingMetadata: boolean;

        selectFile: (file: FileInBrowser) => void;
        selectDirectory: (directory: string) => void;
        openDirectory: (...paths: string[]) => void;
        refresh: () => void;
        resetShuffle: () => void;

        _loadMetadata: () => Promise<void>;
    };
};
