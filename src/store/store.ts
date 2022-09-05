import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { createFileBrowserSlice } from './createFileBrowserSlice';
import { createPlayerSlice } from './createPlayerSlice';
import { FileBrowserSlice } from './FileBrowserSlice';
import { PersistedState } from './PersistedState';
import { PlayerSlice } from './PlayerSlice';

// https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#slices-pattern

export const useStore = create<FileBrowserSlice & PlayerSlice>()(
    persist(
        immer((...a) => ({
            ...createFileBrowserSlice(...a),
            ...createPlayerSlice(...a),
        })),
        {
            name: 'app',
            partialize: (state): PersistedState => {
                return {
                    fileBrowser: {
                        currentPath: state.fileBrowser.currentPath,
                    },
                    player: {
                        activeFile: state.player.activeFile,
                    },
                };
            },
            merge: (persistedState, currentState) => {
                const persistedStateTyped = persistedState as PersistedState;
                return {
                    ...currentState,
                    fileBrowser: {
                        ...currentState.fileBrowser,
                        currentPath: persistedStateTyped.fileBrowser.currentPath,
                    },
                    player: {
                        ...currentState.player,
                        activeFile: persistedStateTyped.player.activeFile
                            ? {
                                  ...persistedStateTyped.player.activeFile,
                              }
                            : undefined,
                    },
                };
            },
            onRehydrateStorage: (state) => {
                return async (state) => {
                    // state!.player._howlLoadAndPlay();
                };
            },
        }
    )
);
