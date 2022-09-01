import FileBrowser from "./FileBrowser";

function App() {
  async function handleOpenFile() {
    const result = await window.electron.openFile();
    console.log(result);
    var audio = new Audio("atom://" + result);
    audio.play();
  }
  return (
    <div className="window">
      <div className="window-content">
        <div className="pane-group">
          <div className="pane">
            <FileBrowser />
          </div>
          <div className="pane">
            <button className="btn btn-primary" onClick={handleOpenFile}>
              Open audio
            </button>
          </div>
        </div>
      </div>
      <footer className="toolbar toolbar-footer">
        <div className="toolbar-actions">
          <div className="btn-group">
            <button className="btn btn-default">
              <span className="icon icon-home"></span>
            </button>
            <button className="btn btn-default">
              <span className="icon icon-folder"></span>
            </button>
            <button className="btn btn-default active">
              <span className="icon icon-cloud"></span>
            </button>
            <button className="btn btn-default">
              <span className="icon icon-popup"></span>
            </button>
            <button className="btn btn-default">
              <span className="icon icon-shuffle"></span>
            </button>
          </div>

          <button className="btn btn-default">
            <span className="icon icon-home icon-text"></span>
            Filters
          </button>

          <button className="btn btn-default btn-dropdown pull-right">
            <span className="icon icon-megaphone"></span>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;

