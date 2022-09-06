import { StateCreator } from 'zustand';
import { ConfigurationSlice } from './ConfigurationSlice';
import { FileBrowserSlice } from '../file-browser/FileBrowserSlice';
import { PlayerSlice } from '../player/PlayerSlice';

export const createConfigurationSlice: StateCreator<
    PlayerSlice & FileBrowserSlice & ConfigurationSlice,
    [['zustand/persist', unknown], ['zustand/immer', never]],
    [],
    ConfigurationSlice
> = (set, get) => ({
    configuration: {
        lastActiveFilePath: '',
        lastPathInFileBrowser: '',
    },
});
