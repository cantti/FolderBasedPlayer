import { useEffect } from 'react';
import { useStore } from './store/store';

export default function useLoadConfiguration() {
    const configuration = useStore((x) => x.configuration);
    const openDirectory = useStore((x) => x.fileBrowser.openDirectory);
    const addFiles = useStore((x) => x.playlist.addFiles);
    const playerOpen = useStore((x) => x.player.open);

    useEffect(() => {
        // load from config
        (async () => {
            openDirectory(configuration.lastPathInFileBrowser);
            if (configuration.lastActiveFilePath) {
                await playerOpen(
                    configuration.lastActiveFilePath,
                    false,
                    configuration.lastPlayingFrom,
                    ''
                );
            }
            await addFiles(configuration.lastPlaylistFiles);
        })();
    }, [
        addFiles,
        configuration.lastActiveFilePath,
        configuration.lastPathInFileBrowser,
        configuration.lastPlayingFrom,
        configuration.lastPlaylistFiles,
        openDirectory,
        playerOpen,
    ]);
}
