import { Howl } from 'howler';
import { FileWithMetadata } from '../../electron/handlers/readMetadata';
import { FileInBrowser } from './FileBrowserSlice';

export type FileInPlayer = FileWithMetadata;

export type PlayerSlice = {
    player: {
        howl?: Howl;
        position: number;
        isPlaying: boolean;
        fromFileBrowser: boolean;
        shuffle: boolean;
        activeFile?: FileInPlayer;

        updatePosition: () => void;
        seek: (position: number) => void;
        toggleShuffle: () => void;
        playNext: () => void;
        open: (path: string) => Promise<void>;
        playPause: () => void;
        _howlLoadAndPlay: () => void;
    };
};
