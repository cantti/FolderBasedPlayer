import { Howl } from 'howler';
import { StateCreator } from 'zustand';
import { FileBrowserSlice } from './FileBrowserSlice';
import { PlayerSlice } from './PlayerSlice';

export const createPlayerSlice: StateCreator<
    FileBrowserSlice & PlayerSlice,
    [['zustand/immer', never]],
    [],
    PlayerSlice
> = (set, get) => ({
    player: {
        howl: undefined,
        position: 0,
        duration: 0,
        desiredPosition: 0,
        isPlaying: false,
        metadata: undefined,
        path: '',
        extension: '',
        fromFileBrowser: false,
        shuffle: false,
        updatePosition: () => {
            set((draft) => {
                draft.player.position = draft.player.howl?.seek() ?? 0;
            });
        },
        seek: (position) => {
            const howl = get().player.howl;
            if (!howl) return;
            howl.seek(position);
            set((state) => {
                state.player.position = position;
            });
        },
        toggleShuffle: () => {
            set((state) => {
                state.player.shuffle = !state.player.shuffle;
            });
        },
        playNext: () => {
            if (get().player.fromFileBrowser) {
                const files = get().fileBrowser.files;
                let toPlay = null;
                if (get().player.shuffle) {
                    toPlay = files[Math.floor(Math.random() * files.length)];
                } else {
                    const foundIndex = files.findIndex((x) => x.path === get().player.path);
                    if (foundIndex < files.length) {
                        toPlay = files[foundIndex + 1];
                    }
                }
                if (!toPlay) return;
                get().player.play(toPlay.path, true);
                set((state) => {
                    state.fileBrowser.isScrollRequired = true;
                });
                get().fileBrowser.selectFile(toPlay);
            }
        },
        play: async (path, fromFileBrowser) => {
            const metadata = await window.electron.readMetadata(path);
            const pathDetails = await window.electron.getPathDetails(path);
            get().player.howl?.off();
            get().player.howl?.unload();
            const howl = new Howl({
                src: ['atom://' + pathDetails.path],
                onload: () => {
                    set((state) => {
                        state.player.duration = howl.duration();
                    });
                },
                onstop: () => {
                    set((state) => {
                        state.player.isPlaying = false;
                    });
                },
                onend: () => {
                    set((state) => {
                        state.player.isPlaying = false;
                    });
                },
            });
            set((state) => {
                state.player.howl = howl;
                state.player.metadata = metadata;
                state.player.path = pathDetails.path;
                state.player.extension = pathDetails.extension;
                state.player.isPlaying = true;
                state.player.fromFileBrowser = fromFileBrowser;
                state.player.position = 0;
            });
            howl.play();
        },
        playPause: () => {
            if (!get().player.path) return;
            const { isPlaying } = get().player;
            if (isPlaying) {
                get().player.howl?.pause();
            } else {
                get().player.howl?.play();
            }
            set((state) => {
                state.player.isPlaying = !state.player.isPlaying;
            });
        },
    },
});