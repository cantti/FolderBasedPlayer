import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { createFileBrowserSlice } from './file-browser/createFileBrowserSlice';
import { createPlayerSlice } from './player/createPlayerSlice';
import { PersistedState } from './PersistedState';
import { createConfigurationSlice } from './configuration/createConfigurationSlice';
import { createPlaylistSlice } from './playlist/createPlaylistSlice';
import { AllSlices } from './AllSlices';
import { v4 as guid } from 'uuid';
import audio from '../audioInstance';

// https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#slices-pattern

export const useStore = create<AllSlices>()(
    persist(
        immer((...a) => ({
            ...createFileBrowserSlice(...a),
            ...createPlayerSlice(...a),
            ...createConfigurationSlice(...a),
            ...createPlaylistSlice(...a),
        })),
        {
            name: 'app',
            partialize: (state): PersistedState => {
                return {
                    configuration: {
                        lastPathInFileBrowser: state.fileBrowser.currentPath,
                        lastActiveFilePath: state.player.activeFile?.path ?? '',
                        lastPlaylistFiles: state.playlist.files.map((x) => x.path),
                        lastPlayingFrom: state.player.playingFrom,
                    },
                    bookmarks: state.fileBrowser.bookmarks
                };
            },
            merge: (persistedState, currentState) => {
                const persistedStateTyped = persistedState as PersistedState | undefined;
                return {
                    ...currentState,
                    ...persistedStateTyped,
                    fileBrowser: {
                        ...currentState.fileBrowser,
                        bookmarks: persistedStateTyped?.bookmarks ?? []
                    }
                };
            },
        }
    )
);

audio.onended = () => {
    useStore.getState().player.playNext();
}

audio.ontimeupdate = () => {
    useStore.getState().player.updatePosition();
}