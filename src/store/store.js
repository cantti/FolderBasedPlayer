import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createFileBrowserSlice } from './createFileBrowserSlice';
import { createPlayerSlice } from './createPlayerSlice';
import produce from 'immer';

export const useStore = create(
    immer(
        subscribeWithSelector((set, get) => ({
            ...createFileBrowserSlice(set, get),
            ...createPlayerSlice(set, get),
        }))
    )
);
