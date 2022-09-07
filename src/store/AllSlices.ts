import { ConfigurationSlice } from "./configuration/ConfigurationSlice";
import { FileBrowserSlice } from "./file-browser/FileBrowserSlice";
import { PlayerSlice } from "./player/PlayerSlice";
import { PlaylistSlice } from "./playlist/PlaylistSlice";

export type AllSlices = PlayerSlice & FileBrowserSlice & ConfigurationSlice & PlaylistSlice;