import FileBrowser from './FileBrowser';
import { useStore } from '../store/store';
import { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Bottom from './Bottom';
import Playlist from './Playlist';
import useLoadConfiguration from '../useLoadConfiguration';

function App() {
    const updatePosition = useStore((x) => x.player.updatePosition);
    const picture = useStore((x) => x.player.activeFile?.picture);

    useLoadConfiguration();

    useEffect(() => {
        const interval = setInterval(() => {
            updatePosition();
        }, 1000);
        return () => clearInterval(interval);
    }, [updatePosition]);

    return (
        <>
            <Container
                fluid
                className="g-0 d-flex flex-column text-light"
                style={{ height: '100vh' }}
            >
                <Row className="g-0 flex-grow-1">
                    <Col xs={6} className="border-end border-1 d-flex">
                        <FileBrowser />
                    </Col>
                    <Col xs={6} className="d-flex">
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
            ></div>
            <div className="background-color"></div>
        </>
    );
}

export default App;
