import FileBrowser from './FileBrowser';
import { useContext } from 'react';
import { PlayerContext } from './PlayerContext';
import Slider from '@mui/material/Slider';
import { Box } from '@mui/material';
import { useState } from 'react';

function App() {
    const player = useContext(PlayerContext);
    const [playingFrom, setPlayingFrom] = useState('');

    function format() {
        const metadata = player.metadata;
        if (!metadata) return '';
        return `${metadata.common.artist} - ${metadata.common.title} (${metadata.common.album})`;
    }

    return (
        <div className="window">
            playingFrom {playingFrom}
            <div className="window-content">
                <div className="pane-group">
                    <div className="pane left-pane">
                        <FileBrowser setPlayingFrom={setPlayingFrom} />
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
                    max={player.duration}
                    value={player.position}
                    onChange={(event, value) => player.setPosition(value)}
                    sx={{ mr: 1 }}
                />
                <Box sx={{ mb: 2, px: 1 }}>
                    {format()}
                    {player.pathDetails?.extension
                        ? ' | ' + player.pathDetails?.extension
                        : ''}
                </Box>
                <div className="toolbar-actions">
                    <div className="btn-group">
                        <button className="btn btn-default">
                            <span
                                className="icon icon-stop"
                                onClick={() => player.stop()}
                            ></span>
                        </button>
                        <button
                            className="btn btn-default"
                            onClick={() => player.playPause()}
                        >
                            <span
                                className={`icon ${
                                    player.isPlaying
                                        ? 'icon-pause'
                                        : 'icon-play'
                                }`}
                            ></span>
                        </button>
                        <button className="btn btn-default active">
                            <span className="icon icon-to-start"></span>
                        </button>
                        <button className="btn btn-default">
                            <span className="icon icon-to-end"></span>
                        </button>
                        <button className="btn btn-default">
                            <span className="icon icon-shuffle"></span>
                        </button>
                    </div>
                    <div className="btn-group">
                        <button className="btn btn-default">
                            <span className="icon icon-loop"></span>
                        </button>
                        <button className="btn btn-default">
                            <span className="icon icon-shuffle"></span>
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
