import { Howl } from 'howler';
import { File } from '../../../electron/handlers/openDirectory';

type PlayerStatus = 'stopped' | 'playing' | 'paused';
type PlayingFrom = 'playlist' | 'fileBrowser';

export type PlayerSlice = {
    player: {
        howl: Howl;
        position: number;
        status: PlayerStatus;
        shuffle: boolean;
        activeFile?: File;
        playingFrom: PlayingFrom;

        updatePosition: () => void;
        seek: (position: number) => void;
        toggleShuffle: () => void;
        playPrev: () => Promise<void>;
        playNext: () => Promise<void>;
        stop: () => void;
        open: (path: string, autoPlay: boolean, playingFrom: PlayingFrom) => Promise<void>;
        playPause: () => Promise<void>;
        _howlLoadActiveFile: () => void;
    };
};
