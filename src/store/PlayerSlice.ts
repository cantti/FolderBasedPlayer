import { Howl } from 'howler';
import { Metadata } from '../../electron/handlers/readMetadata';

export type PlayerSlice = {
    player: {
        howl?: Howl;
        position: number;
        duration: number;
        desiredPosition: number;
        isPlaying: boolean;
        metadata?: Metadata;
        path: string;
        extension: string;
        fromFileBrowser: boolean;
        shuffle: boolean;

        updatePosition: () => void;
        seek: (position: number) => void;
        toggleShuffle: () => void;
        playNext: () => void;
        play: (path: string, fromFileBrowser: boolean) => void;
        playPause: () => void;
    };
};
