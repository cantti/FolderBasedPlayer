import { FileInPlayer } from '../FileInPlayer';

export type PlaylistSlice = {
    playlist: {
        files: FileInPlayer[];
        isReadingMetadata: boolean;

        addFiles: (paths: string[]) => Promise<void>;
        addDirectory: (path: string) => Promise<void>;
        remove: (ids: string[]) => void;
        resetShuffle: () => void;
        clear: () => void;

        _loadMetadata: () => Promise<void>;
    };
};
