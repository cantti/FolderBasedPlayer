import { FileBrowserSlice } from "./FileBrowserSlice";
import { PlayerSlice } from "./PlayerSlice";

export type PersistedState = {
    fileBrowser: Pick<FileBrowserSlice['fileBrowser'], 'currentPath'>;
    player: Pick<PlayerSlice['player'], 'activeFile'>;
};
