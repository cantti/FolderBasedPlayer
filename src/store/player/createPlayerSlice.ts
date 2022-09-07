import { Howl } from 'howler';
import { StateCreator } from 'zustand';
import { AllSlices } from '../AllSlices';
import { FileInBrowser } from '../file-browser/FileBrowserSlice';
import { PlayerSlice } from './PlayerSlice';

export const createPlayerSlice: StateCreator<
    AllSlices,
    // https://github.com/pmndrs/zustand/issues/980#issuecomment-1162289836
    [['zustand/persist', unknown], ['zustand/immer', never]],
    [],
    PlayerSlice
> = (set, get) => ({
    player: {
        howl: new Howl({ src: 'atom://' }), // without random src howler fails
        position: 0,
        status: 'stopped',
        shuffle: false,
        activeFile: undefined,
        playingFrom: 'fileBrowser',
        updatePosition: () => {
            set((draft) => {
                draft.player.position = draft.player.howl.seek();
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
                    const files =
                        draft.player.playingFrom === 'fileBrowser'
                            ? draft.fileBrowser.files
                            : draft.playlist.files;
                    const fileInBrowser = files.find(
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

            const files =
                get().player.playingFrom === 'fileBrowser'
                    ? get().fileBrowser.files
                    : get().playlist.files;

            const activeFile = get().player.activeFile;

            if (get().player.shuffle) {
                const restFiles = files.filter((x) => !x.isPlayedInShuffle);
                if (restFiles.length === 0) {
                    get().fileBrowser.resetShuffle();
                } else {
                    fileToPlay = restFiles[Math.floor(Math.random() * restFiles.length)];
                }
            } else if (files.length > 0) {
                if (activeFile) {
                    const indexOfActiveFile = files.findIndex((x) => x.path === activeFile.path);
                    if (indexOfActiveFile + 1 < files.length) {
                        fileToPlay = files[indexOfActiveFile + 1];
                    }
                } else {
                    fileToPlay = files[0];
                }
            }
            if (fileToPlay) {
                await get().player.open(fileToPlay.path, true, get().player.playingFrom);
            } else {
                get().player.stop();
            }
        },
        playPrev: async () => {
            let fileToPlay: FileInBrowser | undefined;

            const files =
                get().player.playingFrom === 'fileBrowser'
                    ? get().fileBrowser.files
                    : get().playlist.files;

            const activeFile = get().player.activeFile;

            if (get().player.shuffle) {
                // mark current file as not played in shuffle
                if (activeFile) {
                    set((draft) => {
                        const files =
                            draft.player.playingFrom === 'fileBrowser'
                                ? draft.fileBrowser.files
                                : draft.playlist.files;
                        const fileInBrowser = files.find(
                            (x) => x.path === draft.player.activeFile?.path
                        );
                        if (fileInBrowser) {
                            fileInBrowser.isPlayedInShuffle = false;
                        }
                    });
                }
                await get().player.playNext();
            } else if (files.length > 0) {
                if (activeFile) {
                    const indexOfActiveFile = files.findIndex((x) => x.path === activeFile.path);
                    if (indexOfActiveFile - 1 >= 0) {
                        fileToPlay = files[indexOfActiveFile - 1];
                    }
                } else {
                    fileToPlay = files[0];
                }
            }

            if (fileToPlay) {
                await get().player.open(fileToPlay.path, true, get().player.playingFrom);
            } else {
                get().player.stop();
            }
        },
        open: async (path, autoPlay, playingFrom) => {
            const activeFile = await window.electron.readMetadata(path);

            get().player.stop();

            set((draft) => {
                draft.player.playingFrom = playingFrom;
                draft.player.activeFile = activeFile;
                const files =
                    playingFrom === 'fileBrowser' ? draft.fileBrowser.files : draft.playlist.files;
                const file = files.find((x) => x.path === activeFile.path);
                if (file) {
                    file.isPlayedInShuffle = draft.player.shuffle;
                }
            });

            if (autoPlay) {
                await get().player.playPause();
            }
        },
        playPause: async () => {
            if (get().player.activeFile) {
                const status = get().player.status;
                if (status === 'playing') {
                    get().player.howl.pause();
                    set((state) => {
                        state.player.status = 'paused';
                    });
                } else {
                    if (status === 'stopped') {
                        get().player._howlLoadActiveFile();
                    }
                    get().player.howl.play();
                    set((state) => {
                        state.player.status = 'playing';
                    });
                }
            } else {
                await get().player.playNext();
            }
        },
        stop: () => {
            const howl = get().player.howl;
            howl.stop();
            set((state) => {
                state.player.activeFile = undefined;
                state.player.status = 'stopped';
                state.player.position = 0;
            });
        },
        _howlLoadActiveFile: () => {
            const howl = get().player.howl;
            howl.off();
            howl.unload();
            const newHowl = new Howl({
                src: ['atom://' + get().player.activeFile?.path],
                onend: () => {
                    get().player.playNext();
                },
            });
            set((draft) => {
                draft.player.howl = newHowl;
            });
        },
    },
});
