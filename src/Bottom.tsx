import { Form, ButtonGroup, Button, Image } from 'react-bootstrap';

import { useStore } from './store/store';

import {
    BsFillSkipEndFill,
    BsFillSkipStartFill,
    BsPauseFill,
    BsPlayFill,
    BsShuffle,
    BsStopFill,
} from 'react-icons/bs';

function formatSeconds(seconds: number) {
    return new Date(seconds * 1000).toISOString().substring(14, 19);
}

export default function Bottom() {
    const {
        metadata,
        duration,
        position,
        playPause,
        seek,
        playNext,
        shuffle,
        toggleShuffle,
        isPlaying,
        path,
    } = useStore((state) => state.player);

    return (
        <div className="border-top border-4 p-2 mt-auto">
            <Form.Range
                min="0"
                max={duration}
                value={position}
                onChange={(event) => {
                    seek(parseInt(event.target.value));
                }}
            />
            <div className="d-flex">
                <div className="d-flex flex-column">
                    {path && (
                        <div>
                            <div>
                                {metadata?.common.artist} - {metadata?.common.title}
                            </div>
                            <div>
                                {metadata?.common.album} ({metadata?.common.year})
                            </div>
                            <div>{`${formatSeconds(position)} / ${formatSeconds(duration)}`}</div>
                        </div>
                    )}
                    <div className="mt-auto">
                        <ButtonGroup size="sm">
                            <Button
                                variant="secondary"
                                // onClick={() => stop()}
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
                            <Button variant="secondary" onMouseDown={(e) => e.preventDefault()}>
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
                        <Button
                            className="ms-2"
                            size="sm"
                            variant={shuffle ? 'dark' : 'secondary'}
                            onClick={toggleShuffle}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            <BsShuffle />
                        </Button>
                    </div>
                </div>
                <div className="ms-auto">
                    {metadata?.picture && <Image width="150" src={metadata.picture} thumbnail />}
                </div>
            </div>
        </div>
    );
}
