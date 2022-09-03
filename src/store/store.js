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

setInterval(() => {
    useStore.setState({
        player: {
            ...useStore.getState().player,
            position:
                useStore.getState().player.howl != null
                    ? Math.round(useStore.getState().player.howl.seek())
                    : 0,
        },
    });
}, 1000);
