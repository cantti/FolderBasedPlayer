import { Form, ButtonGroup, Button, Image, Dropdown } from 'react-bootstrap';

import { useStore } from '../store/store';

import {
    BsFillSkipEndFill,
    BsFillSkipStartFill,
    BsPauseFill,
    BsPlayFill,
    BsShuffle,
    BsStopFill,
} from 'react-icons/bs';
import { useState } from 'react';
import { formatTitle, leftColFormatStr, rightColFormatStr } from '../formatTitle';

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

    function openInGoogle() {
        const common = activeFile?.metadata?.common;
        const q = encodeURIComponent(`${common?.artist} - ${common?.title} (${common?.album})`);
        const url = `https://www.google.com/search?q=${q}`;
        window.electron.shellOpen(url);
    }

    function openInGoogleLyrics() {
        const common = activeFile?.metadata?.common;
        const q = encodeURIComponent(`Lyrics of ${common?.artist} - ${common?.title}`);
        const url = `https://www.google.com/search?q=${q}`;
        window.electron.shellOpen(url);
    }

    function openInDiscogs() {
        const common = activeFile?.metadata?.common;
        const q = encodeURIComponent(`${common?.artist} - ${common?.album}`);
        const url = `https://www.discogs.com/search/?q=${q}`;
        window.electron.shellOpen(url);
    }

    return (
        <div className="p-2 mt-auto border-1 border-top">
            <Form.Range
                min="0"
                max={activeFile?.metadata?.format.duration}
                step="any"
                value={position}
                onChange={(event) => {
                    seek(parseInt(event.target.value));
                }}
            />
            <div className="d-flex justify-content-between">
                <div className="d-flex flex-column flex-grow-1">
                    {activeFile && (
                        <>
                            <div className="h3">{formatTitle(activeFile, leftColFormatStr)}</div>
                            <div className="h4">{formatTitle(activeFile, rightColFormatStr)}</div>
                            <div className="h5">{`${formatSeconds(position)} / ${formatSeconds(
                                activeFile?.metadata?.format.duration
                            )}`}</div>
                        </>
                    )}
                    <div className="mt-auto d-flex">
                        <ButtonGroup>
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
                            variant={shuffle ? 'outline-light' : 'outline-secondary'}
                            onClick={toggleShuffle}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            <BsShuffle />
                        </Button>
                        <Dropdown className="ms-2">
                            <Dropdown.Toggle
                                variant="outline-light"
                                className="me-2"
                                id="main-menu"
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                Menu
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    onClick={openInGoogle}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    Google: Artist + Title + Album
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={openInGoogleLyrics}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    Google: Lyrics
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={openInDiscogs}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    Discogs: Artist + Album
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <div style={{ minWidth: '200px', width: '200px' }}>
                    {activeFile?.picture && (
                        <Image
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
