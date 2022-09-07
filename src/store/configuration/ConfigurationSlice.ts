import { PlayingFrom } from "../player/PlayerSlice";

export type ConfigurationSlice = {
    configuration: {
        lastPathInFileBrowser: string;
        lastActiveFilePath: string;
        lastPlayingFrom: PlayingFrom;
        lastPlaylistFiles: string[];
    };
};
