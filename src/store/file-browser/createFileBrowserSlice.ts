import { StateCreator } from 'zustand';
import { DirectoryInPlayer, FileBrowserSlice } from './FileBrowserSlice';
import { FileInPlayer } from '../FileInPlayer';
import { AllSlices } from '../AllSlices';
import { v4 as guid } from 'uuid';

export const createFileBrowserSlice: StateCreator<
    AllSlices,
    [['zustand/persist', unknown], ['zustand/immer', never]],
    [],
    FileBrowserSlice
> = (set, get) => ({
    fileBrowser: {
        isVisible: true,
        directories: [],
        files: [],
        currentPath: '',
        isReadingMetadata: false,
        bookmarks: [],

        toggleIsVisible: () => {
            set((draft) => {
                draft.fileBrowser.isVisible = !draft.fileBrowser.isVisible;
            });
        },

        addBookmark: (path) => {
            set((draft) => {
                if (!draft.fileBrowser.bookmarks.includes(path)) {
                    draft.fileBrowser.bookmarks.push(path);
                }
            });
        },

        removeBookmark: (path) => {
            set((draft) => {
                draft.fileBrowser.bookmarks = draft.fileBrowser.bookmarks.filter((x) => x !== path);
            });
        },

        _loadMetadata: async () => {
            if (get().fileBrowser.isReadingMetadata) return;
            set((state) => {
                state.fileBrowser.isReadingMetadata = true;
            });
            while (true) {
                const restFiles = get().fileBrowser.files.filter((x) => !x.isMetadataLoaded);
                if (restFiles.length === 0) break;
                const fileWithMetadata = await window.electron.readMetadata(restFiles[0].path);
                set((draft) => {
                    const file = draft.fileBrowser.files.filter((x) => x.id === restFiles[0].id)[0];
                    file.metadata = fileWithMetadata.metadata;
                    file.isMetadataLoaded = true;
                });
            }
            set((state) => {
                state.fileBrowser.isReadingMetadata = false;
            });
        },

        openDirectory: async (path) => {
            const { files, directories, currentPath } = await window.electron.openDirectory(
                path,
                false
            );
            const filesInBrowser: FileInPlayer[] = files.map((x) => ({
                ...x,
                isPlayedInShuffle: false,
                id: guid(),
            }));

            const directoriesInBrowser: DirectoryInPlayer[] = directories.map((x) => ({
                ...x,
                id: guid(),
            }));

            set((state) => {
                state.fileBrowser.files = filesInBrowser;
                state.fileBrowser.directories = directoriesInBrowser;
                state.fileBrowser.currentPath = currentPath;
            });

            await get().fileBrowser._loadMetadata();
        },

        refresh: () => {
            get().fileBrowser.openDirectory(get().fileBrowser.currentPath);
        },

        resetShuffle: () => {
            set((draft) => {
                draft.fileBrowser.files.forEach((x) => (x.isPlayedInShuffle = false));
            });
        },
    },
});
