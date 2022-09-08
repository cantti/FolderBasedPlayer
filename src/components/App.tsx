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
                    opacity: 0.08,
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
