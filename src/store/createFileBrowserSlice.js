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
            set({
                fileBrowser: {
                    ...get().fileBrowser,
                    isScrollRequired: false,
                },
            });
        },
        toggleShowFileName: () => {
            set({
                fileBrowser: {
                    ...get().fileBrowser,
                    showFileName: !get().fileBrowser.showFileName,
                },
            });
        },
        loadMetadata: async () => {
            if (get().fileBrowser.isReadingMetadata)
                return;
            if (get().fileBrowser.showFileName)
                return;
            set({
                fileBrowser: {
                    ...get().fileBrowser,
                    isReadingMetadata: true,
                },
            });
            const toLoad = get().fileBrowser.files.filter(
                (x) => !x.isMetadataLoaded
            );
            console.log('reading metadata');
            for (const file of toLoad) {
                const metadata = await window.electron.readMetadata(file.path);
                set({
                    fileBrowser: {
                        ...get().fileBrowser,
                        files: get().fileBrowser.files.map((x) => x.name === file.name
                            ? { ...x, metadata, isMetadataLoaded: true }
                            : x
                        ),
                    },
                });
            }
            set({
                fileBrowser: {
                    ...get().fileBrowser,
                    isReadingMetadata: false,
                },
            });
        },
        setSelection: (files) => {
            set({
                fileBrowser: {
                    ...get().fileBrowser,
                    selectedEntries: files,
                },
            });
        },
        openDirectory: async (...paths) => {
            let { files, directories, currentPath } = await window.electron.openDirectory(...paths);

            files = files.map((x) => ({ ...x, isMetadataLoaded: false }));

            set({
                fileBrowser: {
                    ...get().fileBrowser,
                    files,
                    directories,
                    currentPath,
                },
            });
        },
    },
});
