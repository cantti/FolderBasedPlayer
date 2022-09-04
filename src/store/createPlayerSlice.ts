import { Howl } from 'howler';
import { StateCreator } from 'zustand';
import { FileBrowserSlice, FileInBrowser } from './FileBrowserSlice';
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
        isPlaying: false,
        fromFileBrowser: false,
        shuffle: false,
        activeFile: undefined,
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
            const newShuffle = !get().player.shuffle;
            set((state) => {
                state.player.shuffle = newShuffle;
            });
            get().fileBrowser.resetShuffle();
        },
        playNext: () => {
            let fileToPlay: FileInBrowser | undefined;
            if (get().player.shuffle) {
                const restFiles = get().fileBrowser.files.filter((x) => !x.isPlayedInShuffle);
                if (restFiles.length === 0) {
                    get().fileBrowser.resetShuffle();
                    console.log(1)
                    set((draft) => {
                        draft.player.activeFile = undefined;
                    });
                } else {
                    fileToPlay = restFiles[Math.floor(Math.random() * restFiles.length)];
                }
            } else {
                const files = get().fileBrowser.files;
                const activeFile = get().player.activeFile;
                if (activeFile) {
                    const indexOfActiveFile = files.indexOf(activeFile);
                    if (indexOfActiveFile === -1) return;
                    if (indexOfActiveFile + 1 < files.length) {
                        fileToPlay = files[indexOfActiveFile + 1];
                    } else {
                        set((draft) => {
                            draft.player.activeFile = undefined;
                        });
                    }
                } else if (files.length > 0) {
                    fileToPlay = files[0];
                }
            }
            if (!fileToPlay) return;

            get().player.playFile(fileToPlay);
        },
        playFile: async (file) => {
            let metadata = file.metadata;

            if (!file.isMetadataLoaded) {
                metadata = await window.electron.readMetadata(file.path);
            }

            set((draft) => {
                const draftFile = draft.fileBrowser.files.filter((x) => x.path === file.path)[0];
                draftFile.metadata = metadata;
                draftFile.isMetadataLoaded = true;
                draftFile.isPlayedInShuffle = draft.player.shuffle;
                draft.player.activeFile = draftFile;
                draft.player.isPlaying = true;
                draft.player.fromFileBrowser = true;
                draft.player.position = 0;
            });

            get().player._howlLoadAndPlay();
        },
        playPause: () => {
            if (!get().player.activeFile) return;
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
        _howlLoadAndPlay: () => {
            const howl = get().player.howl;
            howl?.off();
            howl?.unload();
            const newHowl = new Howl({
                src: ['atom://' + get().player.activeFile?.path],
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
            newHowl.play();
            set((draft) => {
                draft.player.howl = newHowl;
            });
        },
    },
});
