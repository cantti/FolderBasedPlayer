import { File } from '../../../electron/handlers/openDirectory';

export type FileInPlaylist = File & {
    isPlayedInShuffle: boolean;
};

export type PlaylistSlice = {
    playlist: {
        files: FileInPlaylist[];
        selectedFile?: FileInPlaylist;
        isReadingMetadata: boolean;

        addFiles: (paths: string[]) => Promise<void>;
        addDirectory: (path: string) => Promise<void>;
        selectFile: (file: FileInPlaylist) => void;
        resetShuffle: () => void;
        clear: () => void;

        _loadMetadata: () => Promise<void>;
    };
};
