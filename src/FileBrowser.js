import { useEffect, useState } from "react";

export default function FileBrowser() {
  const [directories, setDirectories] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState("");
  const [showFileName, setShowFileName] = useState(true);
  const [isReadingMetadata, setIsReadingMetadata] = useState(false);

  async function openDirectory(...paths) {
    let { files, directories, currentPath } =
      await window.electron.openDirectory(...paths);

    files = files.map((x) => ({ ...x, isMetadataLoaded: false }));

    setDirectories(directories);
    setFiles(files);
    setCurrentPath(currentPath);
  }

  async function handleDirectoryDoubleClick(name) {
    openDirectory(currentPath, name);
  }

  function handleSelection(file) {
    setSelectedEntries([file.name]);
  }

  function format(file) {
    return `${file.metadata.common.artist} - ${file.metadata.common.title} (${file.metadata.common.album})`;
  }

  async function handleFileDoubleClick(file) {
    var audio = new Audio("atom://" + file.path);
    audio.play();
  }

  useEffect(() => {
    openDirectory(
      "/run/media/cantti/Backup_Silver/music/Reggae/Dub Artists/Alpha & Omega/"
    );
  }, []);

  useEffect(() => {
    (async () => {
      if (showFileName) return;
      if (isReadingMetadata) return;
      setIsReadingMetadata(true);
      const toLoad = files.filter((x) => !x.isMetadataLoaded);
      for (const file of toLoad) {
        const metadata = await window.electron.readMetadata(file.path);
        setFiles((oldFiles) =>
          oldFiles.map((x) =>
            x.name === file.name
              ? { ...x, metadata, isMetadataLoaded: true }
              : x
          )
        );
      }
      setIsReadingMetadata(false);
    })();
  }, [files, isReadingMetadata, showFileName]);

  return (
    <>
      <div className="toolbar">
        <h1 className="title padded-top" style={{ fontWeight: "bold" }}>
          File Browser
        </h1>
        <div className="toolbar-actions">
          <div className="btn-group">
            <button
              className="btn btn-default"
              onClick={() => handleDirectoryDoubleClick("..")}
            >
              <span className="icon icon-up-bold"></span>
              Parent
            </button>
            <button
              className={`btn btn-default ${showFileName ? "active" : ""}`}
              onClick={() => setShowFileName(!showFileName)}
            >
              Show file names
            </button>
          </div>
        </div>
      </div>
      <ul className="list-group file-browser">
        {directories.map((directory) => (
          <li
            className={`list-group-item ${
              selectedEntries.includes(directory) ? "selected" : ""
            }`}
            onClick={() => handleSelection(directory)}
            onDoubleClick={() => handleDirectoryDoubleClick(directory)}
          >
            <div className="media-body">
              <b>{directory}</b>
            </div>
          </li>
        ))}
        {files.map((file) => (
          <li
            className={`list-group-item ${
              selectedEntries.includes(file.name) ? "selected" : ""
            }`}
            onClick={() => handleSelection(file)}
            onDoubleClick={() => handleFileDoubleClick(file)}
          >
            <div className="media-body" style={{ display: "flex" }}>
              {showFileName || !file.isMetadataLoaded ? (
                file.name
              ) : (
                <>
                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {format(file)}
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      overflow: "visible",
                      paddingLeft: "10px",
                    }}
                  >
                    {file.extension}
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
