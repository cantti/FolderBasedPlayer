import { useEffect, useState } from "react";

export default function FileBrowser() {
  const [directories, setDirectories] = useState([]);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState("");

  async function openDirectory(...paths) {
    const { files, directories, currentPath } =
      await window.electron.openDirectory(...paths);
    setDirectories(directories);
    setFiles(files);
    setCurrentPath(currentPath);
  }

  async function handleDirectoryDoubleClick(name) {
    openDirectory(currentPath, name);
  }

  function handleSelection(name) {
    setSelectedEntries([name]);
  }

  useEffect(() => {
    openDirectory();
  }, []);

  return (
    <ul className="list-group">
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
            selectedEntries.includes(file) ? "selected" : ""
          }`}
          onClick={() => handleSelection(file)}
        >
          <div className="media-body">{file} </div>
        </li>
      ))}
    </ul>
  );
}
