import create from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createFileBrowserSlice } from './createFileBrowserSlice';
import { createPlayerSlice } from './createPlayerSlice';

export const useStore = create(
    subscribeWithSelector((set, get) => ({
        ...createFileBrowserSlice(set, get),
        ...createPlayerSlice(set, get),
    }))
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
