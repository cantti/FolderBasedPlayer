import create from 'zustand';

const createFileBrowserSlice = (set, get) => ({
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
            if (get().fileBrowser.isReadingMetadata) return;
            if (get().fileBrowser.showFileName) return;
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
                        files: get().fileBrowser.files.map((x) =>
                            x.name === file.name
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
            let { files, directories, currentPath } =
                await window.electron.openDirectory(...paths);

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

const createPlayerSlice = (set, get) => ({
    player: {
        position: 0,
        duration: 0,
        desiredPosition: 0,
        isPlaying: false,
        metadata: null,
        path: null,
        extension: '',
        playlist: [],
        showFileNameInPlaylist: false,
        seekBarTouched: false,
        fromFileBrowser: false,
        shuffle: false,
        seek: (position) => {
            set({
                player: { ...get().player, position, seekBarTouched: true },
            });
        },
        toggleShuffle: () => {
            set({
                player: {
                    ...get().player,
                    shuffle: !get().player.shuffle,
                },
            });
        },
        playNext: () => {
            if (get().player.fromFileBrowser) {
                const files = get().fileBrowser.files;
                let toPlay = null;
                if (get().player.shuffle) {
                    toPlay = files[Math.floor(Math.random() * files.length)];
                } else {
                    const foundIndex = files.findIndex(
                        (x) => x.path === get().player.path
                    );
                    if (foundIndex < files.length) {
                        toPlay = files[foundIndex + 1];
                    }
                }
                if (!toPlay) return;
                get().player.play(toPlay.path, true);
                set({
                    fileBrowser: {
                        ...get().fileBrowser,
                        isScrollRequired: true,
                    },
                });
                get().fileBrowser.setSelection([toPlay]);
            }
        },
        play: async (path, fromFileBrowser) => {
            const metadata = await window.electron.readMetadata(path);
            const pathDetails = await window.electron.getPathDetails(path);
            set({
                player: {
                    ...get().player,
                    metadata,
                    path: pathDetails.path,
                    extension: pathDetails.extension,
                    isPlaying: true,
                    fromFileBrowser,
                },
            });
        },
        playPause: () => {
            set({
                player: { ...get().player, isPlaying: !get().player.isPlaying },
            });
        },
        setPosition: (position) => {
            set({
                player: { ...get().player, position, seekBarTouched: false },
            });
        },
        setDuration: (duration) => {
            set({ player: { ...get().player, duration } });
        },
        setIsPlaying: (isPlaying) => {
            set({
                player: { ...get().player, isPlaying },
            });
        },
        setCurrentFile: async (path, duration) => {
            const metadata = await window.electron.readMetadata(path);
            const pathDetails = await window.electron.getPathDetails(path);
            set({
                player: { ...get().player, metadata, pathDetails, duration },
            });
        },
        addFilesToPlaylist: (files) => {
            set({
                ...get().player,
                playlist: [...get().player.playlist, files],
            });
        },
    },
});

export const useAppStore = create((set, get) => ({
    ...createFileBrowserSlice(set, get),
    ...createPlayerSlice(set, get),
}));
