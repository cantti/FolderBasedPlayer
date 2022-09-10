import { ConfigurationSlice } from './configuration/ConfigurationSlice';

export type PersistedState = ConfigurationSlice & {
    bookmarks: string[];
};
