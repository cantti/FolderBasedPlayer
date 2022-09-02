import FileBrowser from './FileBrowser';
import { useContext } from 'react';
import Slider from '@mui/material/Slider';
import { Box } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { useAppStore } from './appStore';
import { Howl, Howler } from 'howler';

function App() {
    const {
        setPosition,
        setDuration,
        isPlaying,
        path,
        metadata,
        duration,
        position,
        stop,
        playPause,
        seekBarTouched,
        seek,
        playNext,
        shuffle,
        toggleShuffle,
    } = useAppStore((state) => state.player);

    const howl = useRef(null);

    useEffect(() => {
        if (!howl.current) return;
        if (isPlaying) {
            howl.current.play();
        } else {
            howl.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        if (howl.current) {
            howl.current.unload();
        }
        howl.current = new Howl({
            src: ['atom://' + path],
            onload: () => {
                setDuration(howl.current.duration());
            },
        });
        howl.current.play();
    }, [path, setDuration]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (seekBarTouched) {
                howl.current.seek(position);
                setPosition(position);
            } else {
                setPosition(howl.current ? Math.round(howl.current.seek()) : 0);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [position, seekBarTouched, setPosition]);

    function format() {
        if (!metadata) return '';
        return `${metadata.common.artist} - ${metadata.common.title} (${metadata.common.album})`;
    }

    return (
        <div className="window">
            <div className="window-content">
                <div className="pane-group">
                    <div className="pane left-pane">
                        <FileBrowser />
                    </div>
                    {/* <div className="pane">
            <div className="toolbar">
              <h1 className="title">Playlist</h1>
            </div>

            <button className="btn btn-primary" onClick={handleOpenFile}>
              Open audio
            </button>
          </div> */}
                </div>
            </div>
            <footer className="toolbar toolbar-footer">
                <Slider
                    size="small"
                    max={duration}
                    value={position}
                    onChange={(event, value) => seek(value)}
                    sx={{ mr: 1 }}
                />
                <Box sx={{ mb: 2, px: 1 }}>{format()}</Box>
                <div className="toolbar-actions">
                    <div className="btn-group">
                        <button className="btn btn-default">
                            <span
                                className="icon icon-stop"
                                onClick={() => stop()}
                            ></span>
                        </button>
                        <button
                            className="btn btn-default"
                            onClick={() => playPause()}
                        >
                            <span
                                className={`icon ${
                                    isPlaying ? 'icon-pause' : 'icon-play'
                                }`}
                            ></span>
                        </button>
                        <button className="btn btn-default">
                            <span className="icon icon-to-start"></span>
                        </button>
                        <button className="btn btn-default" onClick={playNext}>
                            <span className="icon icon-to-end"></span>
                        </button>
                    </div>
                    <div className="btn-group">
                        <button
                            className={`btn btn-default ${
                                shuffle ? 'active' : ''
                                }`}
                            onClick={toggleShuffle}
                        >
                            <span className="icon icon-shuffle"></span>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
