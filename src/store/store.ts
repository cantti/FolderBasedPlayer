import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { createFileBrowserSlice } from './file-browser/createFileBrowserSlice';
import { createPlayerSlice } from './player/createPlayerSlice';
import { FileBrowserSlice } from './file-browser/FileBrowserSlice';
import { PersistedState } from './PersistedState';
import { PlayerSlice } from './player/PlayerSlice';
import { ConfigurationSlice } from './configuration/ConfigurationSlice';
import { createConfigurationSlice } from './configuration/createConfigurationSlice';

// https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#slices-pattern

export const useStore = create<FileBrowserSlice & PlayerSlice & ConfigurationSlice>()(
    persist(
        immer((...a) => ({
            ...createFileBrowserSlice(...a),
            ...createPlayerSlice(...a),
            ...createConfigurationSlice(...a),
        })),
        {
            name: 'app',
            partialize: (state): PersistedState => {
                return {
                    configuration: {
                        lastPathInFileBrowser: state.fileBrowser.currentPath,
                        lastActiveFilePath: state.player.activeFile?.path ?? '',
                    },
                };
            },
            merge: (persistedState, currentState) => {
                const persistedStateTyped = persistedState as PersistedState;
                return {
                    ...currentState,
                    ...persistedStateTyped,
                };
            },
            onRehydrateStorage: (state) => {
                return async (state) => {
                    state!.fileBrowser.openDirectory(
                        state!.configuration.lastPathInFileBrowser
                    );
                    if (state!.configuration.lastActiveFilePath) {
                        await state!.player.open(state!.configuration.lastActiveFilePath);
                    }
                };
            },
        }
    )
);
