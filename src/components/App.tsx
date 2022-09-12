import FileBrowser from './FileBrowser';
import { useStore } from '../store/store';
import { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Bottom from './Bottom';
import Playlist from './Playlist';
import useLoadConfiguration from '../useLoadConfiguration';

function App() {
    const picture = useStore((x) => x.player.activeFile?.picture);
    const fileBrowserIsVisible = useStore((state) => state.fileBrowser.isVisible);

    useLoadConfiguration();

    return (
        <>
            <Container
                fluid
                className="g-0 d-flex flex-column text-light"
                style={{ height: '100vh' }}
            >
                <Row className="g-0 flex-grow-1">
                    {fileBrowserIsVisible && (
                        <Col className="border-end border-1 d-flex">
                            <FileBrowser />
                        </Col>
                    )}
                    <Col className="d-flex">
                        <Playlist />
                    </Col>
                </Row>
                <Bottom />
            </Container>
            <div
                className="background-image"
                style={{
                    backgroundImage: `url(${picture})`,
                }}
            />
            <div
                className="background-color"
                style={{
                    opacity: picture ? 0.9 : 1,
                }}
            />
        </>
    );
}

export default App;
