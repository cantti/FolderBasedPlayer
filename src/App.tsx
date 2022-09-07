import FileBrowser from './FileBrowser';
import { useStore } from './store/store';
import { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Bottom from './Bottom';
import Playlist from './Playlist';

function App() {
    const updatePosition = useStore((x) => x.player.updatePosition);

    useEffect(() => {
        const interval = setInterval(() => {
            updatePosition();
        }, 1000);
        return () => clearInterval(interval);
    }, [updatePosition]);

    return (
        <Container
            fluid
            className="p-0 d-flex flex-column  overflow-y-hidden"
            style={{ height: '100vh' }}
        >
            <Row className="g-0 h-100 overflow-y-hidden">
                <Col xs={6} className="h-100 overflow-y-hidden">
                    <FileBrowser />
                </Col>
                <Col xs={6}>
                    <Playlist />
                </Col>
            </Row>
            <Bottom />
        </Container>
    );
}

export default App;
