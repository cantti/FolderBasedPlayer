import { StateCreator } from 'zustand';
import { AllSlices } from '../AllSlices';
import { FileInPlayer } from '../FileInPlayer';
import { PlayerSlice } from './PlayerSlice';
import audio from '../../audioInstance';

export const createPlayerSlice: StateCreator<
    AllSlices,
    // https://github.com/pmndrs/zustand/issues/980#issuecomment-1162289836
    [['zustand/persist', unknown], ['zustand/immer', never]],
    [],
    PlayerSlice
> = (set, get) => ({
    player: {
        position: 0,
        status: 'stopped',
        shuffle: false,
        activeFile: undefined,
        playingFrom: 'fileBrowser',
        updatePosition: () => {
            set((draft) => {
                draft.player.position = audio.currentTime;
            });
        },
        seek: (position) => {
            audio.currentTime = position;
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
                    const file = files.find((x) => x.id === draft.player.activeFile!.id);
                    if (file) {
                        file.isPlayedInShuffle = true;
                    }
                }
            });
        },
        playNext: async () => {
            let fileToPlay: FileInPlayer | undefined;

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
                    const indexOfActiveFile = files.findIndex((x) => x.id === activeFile.id);
                    if (indexOfActiveFile + 1 < files.length) {
                        fileToPlay = files[indexOfActiveFile + 1];
                    }
                } else {
                    fileToPlay = files[0];
                }
            }

            if (fileToPlay) {
                await get().player.open(
                    fileToPlay.path,
                    true,
                    get().player.playingFrom,
                    fileToPlay.id
                );
            } else {
                get().player.stop();
            }
        },
        playPrev: async () => {
            let fileToPlay: FileInPlayer | undefined;

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
                            (x) => x.id === draft.player.activeFile?.id
                        );
                        if (fileInBrowser) {
                            fileInBrowser.isPlayedInShuffle = false;
                        }
                    });
                }
                await get().player.playNext();
            } else if (files.length > 0) {
                if (activeFile) {
                    const indexOfActiveFile = files.findIndex((x) => x.id === activeFile.id);
                    if (indexOfActiveFile - 1 >= 0) {
                        fileToPlay = files[indexOfActiveFile - 1];
                    }
                } else {
                    fileToPlay = files[0];
                }
            }

            if (fileToPlay) {
                await get().player.open(
                    fileToPlay.path,
                    true,
                    get().player.playingFrom,
                    fileToPlay.id
                );
            } else {
                get().player.stop();
            }
        },
        open: async (path, autoPlay, playingFrom, id) => {
            const activeFile = await window.electron.readMetadata(path);

            get().player.stop();

            set((draft) => {
                draft.player.playingFrom = playingFrom;
                draft.player.activeFile = { ...activeFile, id };
                const files =
                    playingFrom === 'fileBrowser' ? draft.fileBrowser.files : draft.playlist.files;
                const file = files.find((x) => x.id === id);
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
                    audio.pause();
                    set((state) => {
                        state.player.status = 'paused';
                    });
                } else {
                    if (status === 'stopped') {
                        audio.pause();
                        audio.currentTime = 0;
                        audio.src = 'atom://' + get().player.activeFile?.path ?? '';
                    }
                    audio.play();
                    set((state) => {
                        state.player.status = 'playing';
                    });
                }
            } else {
                await get().player.playNext();
            }
        },
        stop: () => {
            audio.pause();
            audio.currentTime = 0;
            set((state) => {
                state.player.activeFile = undefined;
                state.player.status = 'stopped';
                state.player.position = 0;
            });
        },
    },
});
