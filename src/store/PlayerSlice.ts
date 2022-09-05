import { Howl } from 'howler';
import { Metadata } from '../../electron/handlers/readMetadata';
import { FileInBrowser } from './FileBrowserSlice';

export type FileInPlayer = Omit<FileInBrowser, 'isPlayedInShuffle'>;

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
        playFile: (file: FileInBrowser) => void;
        playPause: () => void;
        _howlLoadAndPlay: () => void;
    };
};
