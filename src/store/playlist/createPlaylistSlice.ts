import { StateCreator } from 'zustand';
import { AllSlices } from '../AllSlices';
import { PlaylistSlice } from './PlaylistSlice';
import { v4 as guid } from 'uuid';
import { FileInPlayer } from '../FileInPlayer';

export const createPlaylistSlice: StateCreator<
    AllSlices,
    [['zustand/persist', unknown], ['zustand/immer', never]],
    [],
    PlaylistSlice
> = (set, get) => ({
    playlist: {
        files: [],
        isReadingMetadata: false,

        addDirectory: async (path) => {
            const { files } = await window.electron.openDirectory(path, true);
            const filesInPlaylist: FileInPlayer[] = files.map((x) => ({
                ...x,
                isPlayedInShuffle: false,
                id: guid(),
            }));

            set((state) => {
                state.playlist.files.push(...filesInPlaylist);
            });

            await get().playlist._loadMetadata();
        },

        addFiles: async (paths) => {
            set((state) => {
                const files: FileInPlayer[] = paths.map((path) => ({
                    path,
                    isMetadataLoaded: false,
                    extension: '',
                    name: path.replace(/^.*[\\/]/, ''),
                    isPlayedInShuffle: false,
                    picture: '',
                    id: guid(),
                }));
                state.playlist.files.push(...files);
            });
            await get().playlist._loadMetadata();
        },

        remove: (ids) => {
            set((state) => {
                state.playlist.files = state.playlist.files.filter((x) => !ids.includes(x.id));
            });
        },

        clear: () => {
            set((state) => {
                state.playlist.files = [];
            });
        },

        _loadMetadata: async () => {
            if (get().playlist.isReadingMetadata) return;
            set((state) => {
                state.playlist.isReadingMetadata = true;
            });
            const toLoad = get().playlist.files.filter((x) => !x.isMetadataLoaded);
            for (const file of toLoad) {
                const fileWithMetadata = await window.electron.readMetadata(file.path);
                set((state) => {
                    const stateFile = state.playlist.files.filter((x) => x.id === file.id)[0];
                    stateFile.metadata = fileWithMetadata.metadata;
                    stateFile.isMetadataLoaded = true;
                });
            }
            set((state) => {
                state.playlist.isReadingMetadata = false;
            });
        },

        resetShuffle: () => {
            set((draft) => {
                draft.playlist.files.forEach((x) => (x.isPlayedInShuffle = false));
            });
        },
    },
});
