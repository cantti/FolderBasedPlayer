import FileBrowser from "./FileBrowser";

function App() {
  async function handleOpenFile() {
    const result = await window.electron.openFile();
    var audio = new Audio("atom://" + result);
    audio.play();
    const metadata = await window.electron.readMetadata(result);
    console.log(metadata);
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
        <div className="toolbar-actions pull-right">
          <div className="btn-group">
            <button className="btn btn-default">
              <span className="icon icon-stop"></span>
            </button>
            <button className="btn btn-default">
              <span className="icon icon-play"></span>
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
