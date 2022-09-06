import { Howl } from 'howler';
import { File } from '../../../electron/handlers/openDirectory';

export type PlayerSlice = {
    player: {
        howl?: Howl;
        position: number;
        isPlaying: boolean;
        fromFileBrowser: boolean;
        shuffle: boolean;
        activeFile?: File;

        updatePosition: () => void;
        seek: (position: number) => void;
        toggleShuffle: () => void;
        playNext: () => void;
        open: (path: string) => Promise<void>;
        playPause: () => void;
        _howlLoadAndPlay: () => void;
    };
};
