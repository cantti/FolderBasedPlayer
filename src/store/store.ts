import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createFileBrowserSlice } from './createFileBrowserSlice';
import { createPlayerSlice } from './createPlayerSlice';
import { FileBrowserSlice } from './FileBrowserSlice';
import { PlayerSlice } from './PlayerSlice';

export const useStore = create<FileBrowserSlice & PlayerSlice>()(
    immer((...a) => ({
        ...createFileBrowserSlice(...a),
        ...createPlayerSlice(...a),
    }))
);