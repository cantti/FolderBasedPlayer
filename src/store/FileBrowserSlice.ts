import { Metadata } from '../../electron/handlers/readMetadata';
import { File } from '../../electron/handlers/openDirectory';

export type FileInBrowser = File & {
    isMetadataLoaded: boolean;
    metadata?: Metadata;
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
        isScrollRequired: boolean;

        scrolled: () => void;
        toggleShowFileName: () => void;
        loadMetadata: () => void;
        selectFile: (file: FileInBrowser) => void;
        selectDirectory: (directory: string) => void;
        openDirectory: (...paths: string[]) => void;
    };
};
