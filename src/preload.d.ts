import { DirectoryContent } from '../electron/handlers/openDirectory';
import { PathDetails } from '../electron/handlers/getPathDetails';
import { FileWithMetadata } from '../electron/handlers/readMetadata';

declare global {
    interface Window {
        electron: {
            readMetadata(path: string): Promise<FileWithMetadata>;
            openDirectory(...paths: string[]): Promise<DirectoryContent>;
            getPathDetails(path: string): Promise<PathDetails>;
        };
    }
}

export {};
