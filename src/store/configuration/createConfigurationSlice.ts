import { StateCreator } from 'zustand';
import { ConfigurationSlice } from './ConfigurationSlice';
import { AllSlices } from '../AllSlices';

export const createConfigurationSlice: StateCreator<
    AllSlices,
    [['zustand/persist', unknown], ['zustand/immer', never]],
    [],
    ConfigurationSlice
> = (set, get) => ({
    configuration: {
        lastActiveFilePath: '',
        lastPathInFileBrowser: '',
    },
});
