import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createFileBrowserSlice } from './createFileBrowserSlice';
import { createPlayerSlice } from './createPlayerSlice';
import { FileBrowserSlice } from './FileBrowserSlice';
import { PlayerSlice } from './PlayerSlice';

// https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#slices-pattern

export const useStore = create<FileBrowserSlice & PlayerSlice>()(
    immer((...a) => ({
        ...createFileBrowserSlice(...a),
        ...createPlayerSlice(...a),
    }))
);
