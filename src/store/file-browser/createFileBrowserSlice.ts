import { StateCreator } from 'zustand';
import { FileBrowserSlice, FileInBrowser } from './FileBrowserSlice';
import { AllSlices } from '../AllSlices';

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
                    const stateFile = state.fileBrowser.files.filter(
                        (x) => x.path === file.path
                    )[0];
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
            const filesInBrowser: FileInBrowser[] = files.map((x) => ({
                ...x,
                isMetadataLoaded: false,
                isPlayedInShuffle: false,
                picture: '',
                metadata: undefined,
            }));

            set((state) => {
                state.fileBrowser.files = filesInBrowser;
                state.fileBrowser.directories = directories;
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
