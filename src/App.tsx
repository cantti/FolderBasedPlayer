import FileBrowser from './FileBrowser';
import { useStore } from './store/store';
import { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Bottom from './Bottom';
import Playlist from './Playlist';
import { v4 as guid } from 'uuid';

function App() {
    const updatePosition = useStore((x) => x.player.updatePosition);
    const playerOpen = useStore((x) => x.player.open);
    const picture = useStore((x) => x.player.activeFile?.picture);
    const openDirectory = useStore((x) => x.fileBrowser.openDirectory);
    const addFiles = useStore((x) => x.playlist.addFiles);
    const configuration = useStore((x) => x.configuration);

    useEffect(() => {
        const interval = setInterval(() => {
            updatePosition();
        }, 1000);
        return () => clearInterval(interval);
    }, [updatePosition]);

    useEffect(() => {
        // load from config
        (async () => {
            openDirectory(configuration.lastPathInFileBrowser);
            if (configuration.lastActiveFilePath) {
                await playerOpen(
                    configuration.lastActiveFilePath,
                    false,
                    configuration.lastPlayingFrom,
                    guid()
                );
            }
            await addFiles(configuration.lastPlaylistFiles);
        })();
    }, [addFiles, configuration, openDirectory, playerOpen]);

    return (
        <Container
            fluid
            className="p-0 d-flex flex-column overflow-y-hidden text-light"
            style={{ height: '100vh' }}
        >
            <div
                style={{
                    position: 'absolute',
                    backgroundImage: `url(${picture})`,
                    backgroundSize: 'auto',
                    // backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    opacity: 0.05,
                    height: '100vh',
                    width: '100%',
                    pointerEvents: 'none',
                }}
            ></div>
            <Row className="g-0 h-100 overflow-y-hidden">
                <Col xs={6} className="h-100 overflow-y-hidden border-end border-1">
                    <FileBrowser />
                </Col>
                <Col xs={6} className="h-100 overflow-y-hidden">
                    <Playlist />
                </Col>
            </Row>
            <Bottom />
        </Container>
    );
}

export default App;
