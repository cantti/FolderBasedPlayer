import { useEffect, useRef } from 'react';
import { useStore } from './store/store';
import { ButtonGroup, Button, Form, ListGroup, Navbar } from 'react-bootstrap';
import { BsArrow90DegUp } from 'react-icons/bs';

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
        selectedDirectory,
        selectDirectory,
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

    async function handleFileDoubleClick(file) {
        play(file.path, true);
    }

    useEffect(() => {
        openDirectory('/run/media/cantti/Backup_Silver/music/Reggae/Dub Artists/Alpha & Omega/');
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
        <div className="d-flex flex-column" style={{ overflowY: 'hidden' }}>
            <div className="p-2 border-4 border-bottom">
                <div className="d-flex">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleDirectoryDoubleClick('..')}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <BsArrow90DegUp />
                    </Button>
                    <Button
                        size="sm"
                        className="me-2 text-nowrap"
                        variant={showFileName ? 'dark' : 'secondary'}
                        onClick={toggleShowFileName}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        Show file names
                    </Button>
                    <Form.Control type="text" value={currentPath} size="sm" readOnly />
                </div>
            </div>

            <div style={{ overflowY: 'auto' }}>
                {directories.map((directory) => (
                    <div
                        className={`border-bottom p-2 ${
                            selectedDirectory === directory ? 'bg-primary text-light' : ''
                        }`}
                        onClick={() => selectDirectory(directory)}
                        onDoubleClick={() => handleDirectoryDoubleClick(directory)}
                    >
                        <b>{directory}</b>
                    </div>
                ))}
                {files.map((file, index) => (
                    <div
                        className={`border-bottom p-2 ${
                            selectedEntries.includes(file) ? 'bg-primary text-light' : ''
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
                                    <div className="text-truncate">{`${file.metadata.common.artist} - ${file.metadata.common.title}`}</div>
                                    <div className="text-nowrap ms-auto ps-4">
                                        {`${file.metadata.common.album} (${file.metadata.common.year})`}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
