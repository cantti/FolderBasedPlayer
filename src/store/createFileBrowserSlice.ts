import { StateCreator } from 'zustand';
import { FileBrowserSlice } from './FileBrowserSlice';
import { PlayerSlice } from './PlayerSlice';
import { FileInBrowser } from './FileBrowserSlice';

export const createFileBrowserSlice: StateCreator<
    FileBrowserSlice & PlayerSlice,
    [['zustand/immer', never]],
    [],
    FileBrowserSlice
> = (set, get) => ({
    fileBrowser: {
        directories: [],
        files: [],
        currentPath: '',
        selectedEntries: [],
        selectedDirectory: '',
        showFileName: false,
        isReadingMetadata: false,
        isScrollRequired: false,
        scrolled: () => {
            set((state) => {
                state.fileBrowser.isScrollRequired = false;
            });
        },
        toggleShowFileName: () => {
            set((state) => {
                state.fileBrowser.showFileName = !state.fileBrowser.showFileName;
            });
        },
        loadMetadata: async () => {
            if (get().fileBrowser.isReadingMetadata) return;
            if (get().fileBrowser.showFileName) return;
            set((state) => {
                state.fileBrowser.isReadingMetadata = true;
            });
            const toLoad = get().fileBrowser.files.filter((x) => !x.isMetadataLoaded);
            console.log('reading metadata');
            for (const file of toLoad) {
                const metadata = await window.electron.readMetadata(file.path);
                set((state) => {
                    const stateFile = state.fileBrowser.files.filter(
                        (x) => x.path === file.path
                    )[0];
                    stateFile.metadata = metadata;
                    stateFile.isMetadataLoaded = true;
                });
            }
            set((state) => {
                state.fileBrowser.isReadingMetadata = false;
            });
        },
        setSelection: (files) => {
            set((state) => {
                state.fileBrowser.selectedEntries = files;
            });
        },
        selectDirectory: (directory) => {
            set((state) => {
                state.fileBrowser.selectedDirectory = directory;
            });
        },
        openDirectory: async (...paths) => {
            const { files, directories, currentPath } = await window.electron.openDirectory(
                ...paths
            );
            const filesInBrowser: FileInBrowser[] = files.map((x) => ({
                ...x,
                isMetadataLoaded: false,
            }));
            set((state) => {
                state.fileBrowser.files = filesInBrowser;
                state.fileBrowser.directories = directories;
                state.fileBrowser.currentPath = currentPath;
            });
        },
    },
});
