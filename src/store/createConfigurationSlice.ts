import { StateCreator } from 'zustand';
import { ConfigurationSlice } from './ConfigurationSlice';
import { FileBrowserSlice } from './FileBrowserSlice';
import { PlayerSlice } from './PlayerSlice';

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
