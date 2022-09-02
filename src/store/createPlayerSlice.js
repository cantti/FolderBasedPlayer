import { Howl } from 'howler';

export const createPlayerSlice = (set, get) => ({
    player: {
        howl: null,
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
            get().player.howl.seek(position);
            set({ player: { ...get().player, position } });
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
                if (!toPlay)
                    return;
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
            get().player.howl?.off();
            get().player.howl?.unload();
            const howl = new Howl({
                src: ['atom://' + get().player.path],
                onload: () => {
                    set({
                        player: { ...get().player, duration: howl.duration() },
                    });
                },
                onstop: () => {
                    set({ player: { ...get().player, isPlaying: false } });
                },
                onend: () => {
                    set({ player: { ...get().player, isPlaying: false } });
                },
            });
            set({
                player: {
                    ...get().player,
                    howl,
                },
            });
            howl.play();
        },
        playPause: () => {
            const { isPlaying } = get().player;
            if (isPlaying) {
                get().player.howl.pause();
            } else {
                get().player.howl.play();
            }
            set({
                player: { ...get().player, isPlaying: !isPlaying },
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
