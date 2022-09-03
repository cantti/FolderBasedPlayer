import FileBrowser from './FileBrowser';
import { useStore } from './store/store';
import { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Bottom from './Bottom';

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
            className="p-0 d-flex flex-column"
            style={{ height: '100vh' }}
        >
            <FileBrowser />
            <Bottom />
        </Container>
    );
}

export default App;
