import { File } from '../../electron/handlers/openDirectory';


export type FileInPlayer = File & {
    isPlayedInShuffle: boolean;
    id: string;
};
