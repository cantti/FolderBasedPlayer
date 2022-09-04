import { Metadata } from './store/createFileBrowserSlice';
import { DirectoryContent } from '../electron/handlers/openDirectory';
import { PathDetails } from '../electron/handlers/getPathDetails';

declare global {
    interface Window {
        electron: {
            readMetadata(path: string): Promise<Metadata>;
            openDirectory(...paths: string[]): Promise<DirectoryContent>;
            getPathDetails(path: string): Promise<PathDetails>;
        };
    }
}

export {};
