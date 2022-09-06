import { Howl } from 'howler';
import { File } from '../../../electron/handlers/openDirectory';

type PlayerStatus = 'stopped' | 'playing' | 'paused';

export type PlayerSlice = {
    player: {
        howl: Howl;
        position: number;
        status: PlayerStatus;
        fromFileBrowser: boolean;
        shuffle: boolean;
        activeFile?: File;

        updatePosition: () => void;
        seek: (position: number) => void;
        toggleShuffle: () => void;
        playPrev: () => Promise<void>;
        playNext: () => Promise<void>;
        stop: () => void;
        open: (path: string, autoPlay: boolean) => Promise<void>;
        playPause: () => Promise<void>;
        _howlLoadActiveFile: () => void;
    };
};
