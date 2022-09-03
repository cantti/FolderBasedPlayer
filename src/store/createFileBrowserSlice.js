export const createFileBrowserSlice = (set, get) => ({
    fileBrowser: {
        directories: [],
        files: [],
        currentPath: '',
        selectedEntries: [],
        showFileName: true,
        isReadingMetadata: false,
        isScrollRequired: false,
        scrolled: () => {
            set((state) => {
                state.fileBrowser.isScrollRequired = false;
            });
        },
        toggleShowFileName: () => {
            set((state) => {
                state.fileBrowser.showFileName =
                    !state.fileBrowser.showFileName;
            });
        },
        loadMetadata: async () => {
            if (get().fileBrowser.isReadingMetadata) return;
            if (get().fileBrowser.showFileName) return;
            set((state) => {
                state.fileBrowser.isReadingMetadata = true;
            });
            const toLoad = get().fileBrowser.files.filter(
                (x) => !x.isMetadataLoaded
            );
            console.log('reading metadata');
            for (const file of toLoad) {
                const metadata = await window.electron.readMetadata(file.path);
                set((state) => {
                    const stateFile = state.fileBrowser.files.find(
                        (x) => x.path === file.path
                    );
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
        openDirectory: async (...paths) => {
            let { files, directories, currentPath } =
                await window.electron.openDirectory(...paths);
            files = files.map((x) => ({ ...x, isMetadataLoaded: false }));
            set((state) => {
                state.fileBrowser.files = files;
                state.fileBrowser.directories = directories;
                state.fileBrowser.currentPath = currentPath;
            });
        },
    },
});
