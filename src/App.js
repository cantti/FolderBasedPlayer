import FileBrowser from './FileBrowser';
import Slider from '@mui/material/Slider';
import { Box } from '@mui/material';
import { useStore } from './store';

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
        isPlaying
    } = useStore((state) => state.player);

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
