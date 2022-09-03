import FileBrowser from './FileBrowser';
import Slider from '@mui/material/Slider';
import { Box } from '@mui/material';
import { useStore } from './store/store';
import { useEffect } from 'react';
import { Form, Container, ButtonGroup, Button } from 'react-bootstrap';

function App() {
    const {
        metadata,
        duration,
        position,
        stop,
        playPause,
        seek,
        playNext,
        shuffle,
        toggleShuffle,
        isPlaying,
        updatePosition,
        path,
    } = useStore((state) => state.player);

    useEffect(() => {
        const interval = setInterval(() => {
            updatePosition();
        }, 1000);
        return () => clearInterval(interval);
    }, [updatePosition]);

    function format() {
        if (!metadata) return '';
        return `${metadata.common.artist} - ${metadata.common.title} (${metadata.common.album})`;
    }

    return (
        <Container
            fluid
            className="p-1 d-flex flex-column"
            style={{ height: '100vh' }}
        >
            <FileBrowser />

            <div className="border-top mt-auto">
                <Form.Range
                    size="sm"
                    min="0"
                    max={duration}
                    value={position}
                    onChange={(event) => {
                        seek(parseInt(event.target.value));
                    }}
                />

                {path && (
                    <Box sx={{ px: 1 }}>
                        <p>
                            {metadata.common.artist} - {metadata.common.title}
                        </p>
                        <p>
                            {metadata.common.album} ({metadata.common.year})
                        </p>
                        <p>
                            {new Date(position * 1000)
                                .toISOString()
                                .substring(14, 19)}
                            {' / '}
                            {new Date(duration * 1000)
                                .toISOString()
                                .substring(14, 19)}
                        </p>
                    </Box>
                )}
                <ButtonGroup>
                    <Button variant="secondary" onClick={() => stop()}>Stop</Button>
                    <Button variant="secondary" onClick={() => stop()}>Play/Pause</Button>
                    <Button variant="secondary">Prev</Button>
                    <Button variant="secondary" onClick={playNext}>Next</Button>
                    <Button variant="secondary" onClick={toggleShuffle}>shuffle</Button>
                </ButtonGroup>
            </div>
        </Container>
    );
}

export default App;
