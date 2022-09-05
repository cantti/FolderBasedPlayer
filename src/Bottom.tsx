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
    const { activeFile, position, playPause, seek, playNext, shuffle, toggleShuffle, isPlaying } =
        useStore((state) => state.player);

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
        <div className="border-top border-4 p-2 mt-auto">
            <Form.Range
                min="0"
                max={activeFile?.metadata?.format.duration}
                value={position}
                onChange={(event) => {
                    seek(parseInt(event.target.value));
                }}
            />
            <div className="d-flex">
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
                    {activeFile?.metadata?.picture && (
                        <Image
                            width="150"
                            src={activeFile?.metadata.picture}
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
