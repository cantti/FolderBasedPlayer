import { StateCreator } from 'zustand';
import { AllSlices } from '../AllSlices';
import { FileInPlaylist, PlaylistSlice } from './PlaylistSlice';

export const createPlaylistSlice: StateCreator<
    AllSlices,
    [['zustand/persist', unknown], ['zustand/immer', never]],
    [],
    PlaylistSlice
> = (set, get) => ({
    playlist: {
        files: [],
        selectedFile: undefined,
        isReadingMetadata: false,

        addDirectory: async (path) => {
            const { files } = await window.electron.openDirectory(path);
            const filesInPlaylist: FileInPlaylist[] = files.map((x) => ({
                ...x,
                isMetadataLoaded: false,
                isPlayedInShuffle: false,
                picture: '',
                metadata: undefined,
            }));

            set((state) => {
                state.playlist.files.push(...filesInPlaylist);
            });

            await get().playlist._loadMetadata();
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
                    const stateFile = state.playlist.files.filter((x) => x.path === file.path)[0];
                    stateFile.metadata = fileWithMetadata.metadata;
                    stateFile.isMetadataLoaded = true;
                });
            }
            set((state) => {
                state.playlist.isReadingMetadata = false;
            });
        },

        selectFile: (file) => {
            set((state) => {
                state.playlist.selectedFile = file;
            });
        },

        resetShuffle: () => {
            set((draft) => {
                draft.playlist.files.forEach((x) => (x.isPlayedInShuffle = false));
            });
        },
    },
});
