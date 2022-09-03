import FileBrowser from './FileBrowser';
import { useStore } from './store/store';
import { useEffect } from 'react';
import {
    Form,
    Container,
    ButtonGroup,
    Button,
    ToggleButton,
} from 'react-bootstrap';
import {
    BsFillSkipEndFill,
    BsFillSkipStartFill,
    BsPauseFill,
    BsPlayFill,
    BsShuffle,
    BsStopFill,
} from 'react-icons/bs';

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
                    <div>
                        <div>
                            {metadata.common.artist} - {metadata.common.title}
                        </div>
                        <div>
                            {metadata.common.album} ({metadata.common.year})
                        </div>
                        <div>
                            {new Date(position * 1000)
                                .toISOString()
                                .substring(14, 19)}
                            {' / '}
                            {new Date(duration * 1000)
                                .toISOString()
                                .substring(14, 19)}
                        </div>
                    </div>
                )}
                <ButtonGroup size="sm">
                    <Button
                        variant="secondary"
                        onClick={() => stop()}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <BsStopFill />
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => playPause()}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        {isPlaying ? <BsPauseFill /> : <BsPlayFill />}
                    </Button>
                    <Button
                        variant="secondary"
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <BsFillSkipStartFill />
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={playNext}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <BsFillSkipEndFill />
                    </Button>
                </ButtonGroup>
                <ToggleButton
                    className="ms-2"
                    size="sm"
                    variant={shuffle ? 'dark' : 'secondary'}
                    onClick={toggleShuffle}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <BsShuffle />
                </ToggleButton>
            </div>
        </Container>
    );
}

export default App;
