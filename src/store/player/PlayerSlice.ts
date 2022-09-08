import { FileInPlayer } from "../FileInPlayer";

export type PlayerStatus = 'stopped' | 'playing' | 'paused';
export type PlayingFrom = 'playlist' | 'fileBrowser';

export type PlayerSlice = {
    player: {
        position: number;
        status: PlayerStatus;
        shuffle: boolean;
        activeFile?: Omit<FileInPlayer, 'isPlayedInShuffle' | 'isMetadataRead'>;
        playingFrom: PlayingFrom;

        updatePosition: () => void;
        seek: (position: number) => void;
        toggleShuffle: () => void;
        playPrev: () => Promise<void>;
        playNext: () => Promise<void>;
        stop: () => void;
        open: (
            path: string,
            autoPlay: boolean,
            playingFrom: PlayingFrom,
            id: string
        ) => Promise<void>;
        playPause: () => Promise<void>;
    };
};
