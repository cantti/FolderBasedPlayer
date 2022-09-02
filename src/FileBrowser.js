import { useEffect, useRef } from 'react';
import { useStore } from './store/store';

export default function FileBrowser({ setPlayingFrom }) {
    const {
        openDirectory,
        currentPath,
        setSelection,
        showFileName,
        toggleShowFileName,
        loadMetadata,
        directories,
        files,
        selectedEntries,
        isScrollRequired,
        scrolled,
    } = useStore((state) => state.fileBrowser);

    const play = useStore((state) => state.player.play);

    const filesRef = useRef([]);

    useEffect(() => {
        filesRef.current = filesRef.current.slice(0, files.length);
    }, [files]);

    async function handleDirectoryDoubleClick(name) {
        openDirectory(currentPath, name);
    }

    function handleSelection(file) {
        setSelection([file]);
    }

    function format(file) {
        return `${file.metadata.common.artist} - ${file.metadata.common.title} (${file.metadata.common.album})`;
    }

    async function handleFileDoubleClick(file) {
        play(file.path, true);
    }

    useEffect(() => {
        openDirectory(
            '/run/media/cantti/Backup_Silver/music/Reggae/Dub Artists/Alpha & Omega/'
        );
    }, [openDirectory]);

    useEffect(() => {
        loadMetadata();
    }, [loadMetadata, files, showFileName]);

    useEffect(() => {
        if (selectedEntries.length === 0) return;
        if (!isScrollRequired) return;
        const selected = selectedEntries[0];
        const selectedRef = filesRef.current[files.indexOf(selected)];
        selectedRef.scrollIntoView();
        scrolled();
    }, [isScrollRequired, files, selectedEntries, scrolled]);

    return (
        <>
            <div className="toolbar">
                <h1 className="title padded-top" style={{ fontWeight: 'bold' }}>
                    File Browser
                </h1>
                <div className="toolbar-actions">
                    <div className="btn-group">
                        <button
                            className="btn btn-default"
                            onClick={() => handleDirectoryDoubleClick('..')}
                        >
                            <span className="icon icon-up-bold"></span>
                            Parent
                        </button>
                        <button
                            className={`btn btn-default ${
                                showFileName ? 'active' : ''
                            }`}
                            onClick={toggleShowFileName}
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
                            selectedEntries.includes(directory)
                                ? 'selected'
                                : ''
                        }`}
                        onClick={() => handleSelection(directory)}
                        onDoubleClick={() =>
                            handleDirectoryDoubleClick(directory)
                        }
                    >
                        <div className="media-body">
                            <b>{directory}</b>
                        </div>
                    </li>
                ))}
                {files.map((file, index) => (
                    <li
                        className={`list-group-item ${
                            selectedEntries.includes(file) ? 'selected' : ''
                        }`}
                        onClick={() => handleSelection(file)}
                        onDoubleClick={() => handleFileDoubleClick(file)}
                        ref={(el) => (filesRef.current[index] = el)}
                    >
                        <div className="media-body" style={{ display: 'flex' }}>
                            {showFileName || !file.isMetadataLoaded ? (
                                file.name
                            ) : (
                                <>
                                    <div
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {format(file)}
                                    </div>
                                    <div
                                        style={{
                                            marginLeft: 'auto',
                                            overflow: 'visible',
                                            paddingLeft: '10px',
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
