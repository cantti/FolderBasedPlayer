import { File } from '../../../electron/handlers/openDirectory';

export type FileInBrowser = File & {
    isMetadataLoaded: boolean;
    isPlayedInShuffle: boolean;
};

export type FileBrowserSlice = {
    fileBrowser: {
        directories: string[];
        files: FileInBrowser[];
        currentPath: string;
        selectedFile?: FileInBrowser;
        selectedDirectory: string;
        showFileName: boolean;
        isReadingMetadata: boolean;

        toggleShowFileName: () => void;
        loadMetadata: () => void;
        selectFile: (file: FileInBrowser) => void;
        selectDirectory: (directory: string) => void;
        openDirectory: (...paths: string[]) => void;
        refresh: () => void;
        resetShuffle: () => void;
    };
};
