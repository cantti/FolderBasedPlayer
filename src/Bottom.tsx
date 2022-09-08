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
import { useState } from 'react';

function formatSeconds(seconds?: number) {
    if (!seconds) return '00:00';
    return new Date(seconds * 1000).toISOString().substring(14, 19);
}

export default function Bottom() {
    const activeFile = useStore((state) => state.player.activeFile);
    const position = useStore((state) => state.player.position);
    const playPause = useStore((state) => state.player.playPause);
    const stop = useStore((state) => state.player.stop);
    const seek = useStore((state) => state.player.seek);
    const playNext = useStore((state) => state.player.playNext);
    const playPrev = useStore((state) => state.player.playPrev);
    const shuffle = useStore((state) => state.player.shuffle);
    const toggleShuffle = useStore((state) => state.player.toggleShuffle);
    const status = useStore((state) => state.player.status);

    const [picturesWindow, setPicturesWindow] = useState<Window>();

    function handlePictureClick() {
        picturesWindow?.close();
        const newPicturesWindow = window.open(
            `/#/pictures/${encodeURIComponent(activeFile!.path)}`,
            '_blank',
            'autoHideMenuBar=true'
        );
        if (newPicturesWindow) {
            newPicturesWindow.electron = window.electron;
        }
        setPicturesWindow(newPicturesWindow ?? undefined);
    }

    return (
        <div className="p-2 mt-auto fs-4">
            {/* <div
                style={{
                    position: 'absolute',
                    backgroundImage: `url(${activeFile?.picture})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.1,
                    height: '100vh',
                    width: '100%',
                    pointerEvents: 'none',
                }}
            ></div> */}
            <Form.Range
                min="0"
                max={activeFile?.metadata?.format.duration}
                value={position}
                onChange={(event) => {
                    seek(parseInt(event.target.value));
                }}
            />
            <div className="d-flex justify-content-center">
                <div className="d-flex flex-column">
                    {activeFile && (
                        <div>
                            <div>
                                {activeFile?.metadata?.common.artist} -{' '}
                                {activeFile?.metadata?.common.title}
                            </div>
                            <div>
                                {activeFile?.metadata?.common.album} (
                                {activeFile?.metadata?.common.year})
                            </div>
                            <div>{`${formatSeconds(position)} / ${formatSeconds(
                                activeFile?.metadata?.format.duration
                            )}`}</div>
                        </div>
                    )}
                    <div className="mt-auto">
                        <ButtonGroup size="sm">
                            <Button
                                variant="outline-light"
                                onClick={() => stop()}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <BsStopFill />
                            </Button>
                            <Button
                                variant="outline-light"
                                onClick={() => playPause()}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                {status === 'playing' ? <BsPauseFill /> : <BsPlayFill />}
                            </Button>
                            <Button
                                variant="outline-light"
                                onClick={playPrev}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <BsFillSkipStartFill />
                            </Button>
                            <Button
                                variant="outline-light"
                                onClick={playNext}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                <BsFillSkipEndFill />
                            </Button>
                        </ButtonGroup>
                        <Button
                            className="ms-2"
                            size="sm"
                            variant={shuffle ? 'outline-secondary' : 'outline-light'}
                            onClick={toggleShuffle}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            <BsShuffle />
                        </Button>
                    </div>
                </div>
                <div className="ms-auto">
                    {activeFile?.picture && (
                        <Image
                            width="150"
                            src={activeFile?.picture}
                            thumbnail
                            onClick={() => handlePictureClick()}
                            style={{ cursor: 'pointer' }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
