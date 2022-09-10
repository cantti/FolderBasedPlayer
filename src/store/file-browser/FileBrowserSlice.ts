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
        bookmarks: string[];

        addBookmark: (path: string) => void;
        removeBookmark: (path: string) => void;
        openDirectory: (path: string) => void;
        refresh: () => void;
        resetShuffle: () => void;

        _loadMetadata: () => Promise<void>;
    };
};
