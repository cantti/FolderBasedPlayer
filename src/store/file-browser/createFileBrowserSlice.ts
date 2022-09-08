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
        directories: [],
        files: [],
        currentPath: '',
        isReadingMetadata: false,

        _loadMetadata: async () => {
            if (get().fileBrowser.isReadingMetadata) return;
            set((state) => {
                state.fileBrowser.isReadingMetadata = true;
            });
            const toLoad = get().fileBrowser.files.filter((x) => !x.isMetadataLoaded);
            for (const file of toLoad) {
                const fileWithMetadata = await window.electron.readMetadata(file.path);
                set((state) => {
                    const stateFile = state.fileBrowser.files.filter((x) => x.id === file.id)[0];
                    stateFile.metadata = fileWithMetadata.metadata;
                    stateFile.isMetadataLoaded = true;
                });
            }
            set((state) => {
                state.fileBrowser.isReadingMetadata = false;
            });
        },
        openDirectory: async (...paths) => {
            const { files, directories, currentPath } = await window.electron.openDirectory(
                ...paths
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
