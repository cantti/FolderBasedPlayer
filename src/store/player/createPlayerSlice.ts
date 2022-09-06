import { Howl } from 'howler';
import { StateCreator } from 'zustand';
import { ConfigurationSlice } from '../configuration/ConfigurationSlice';
import { FileBrowserSlice, FileInBrowser } from '../file-browser/FileBrowserSlice';
import { PlayerSlice } from './PlayerSlice';

export const createPlayerSlice: StateCreator<
    PlayerSlice & FileBrowserSlice & ConfigurationSlice,
    // https://github.com/pmndrs/zustand/issues/980#issuecomment-1162289836
    [['zustand/persist', unknown], ['zustand/immer', never]],
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
            get().fileBrowser.resetShuffle();
            set((draft) => {
                draft.player.shuffle = newShuffle;
                // mark currently playing file as played
                if (newShuffle && draft.player.activeFile) {
                    const fileInBrowser = draft.fileBrowser.files.find(
                        (x) => x.path === draft.player.activeFile!.path
                    );
                    if (fileInBrowser) {
                        fileInBrowser.isPlayedInShuffle = true;
                    }
                }
            });
        },
        playNext: async () => {
            let fileToPlay: FileInBrowser | undefined;
            if (get().player.shuffle) {
                const restFiles = get().fileBrowser.files.filter((x) => !x.isPlayedInShuffle);
                if (restFiles.length === 0) {
                    get().fileBrowser.resetShuffle();
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
                    const indexOfActiveFile = files.findIndex((x) => x.path === activeFile.path);
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

            await get().player.open(fileToPlay.path);
            get().player.playPause();
        },
        open: async (path) => {
            const activeFile = await window.electron.readMetadata(path);

            set((draft) => {
                draft.player.activeFile = activeFile;
                
                // in case was playing
                draft.player.isPlaying = false;
                
                draft.player.fromFileBrowser = true;
                draft.player.position = 0;
                const fileInBrowser = draft.fileBrowser.files.find(
                    (x) => x.path === activeFile.path
                );
                if (fileInBrowser) {
                    fileInBrowser.isPlayedInShuffle = draft.player.shuffle;
                }
            });
        },
        playPause: () => {
            if (!get().player.activeFile) return;
            const { isPlaying } = get().player;
            if (isPlaying) {
                get().player.howl?.pause();
            } else {
                // if we loaded from storage
                if (!get().player.howl) {
                    get().player._howlLoadAndPlay();
                } else {
                    get().player.howl?.play();
                }
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
