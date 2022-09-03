import { useEffect, useRef } from 'react';
import { useStore } from './store/store';
import { ButtonGroup, Button, Form, ListGroup, Navbar } from 'react-bootstrap';

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
        <div className="d-flex flex-column" style={{ overflowY: 'hidden' }}>
            <div className="bg-light">
                <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleDirectoryDoubleClick('..')}
                >
                    Open parent
                </Button>
                <Form.Check
                    type="switch"
                    id="custom-switch"
                    label="Show file names"
                    checked={showFileName}
                    onChange={toggleShowFileName}
                />
            </div>

            <ListGroup style={{ overflowY: 'auto' }}>
                {directories.map((directory) => (
                    <ListGroup.Item
                        onClick={() => handleSelection(directory)}
                        onDoubleClick={() =>
                            handleDirectoryDoubleClick(directory)
                        }
                    >
                        <b>{directory}</b>
                    </ListGroup.Item>
                ))}
                {files.map((file, index) => (
                    <ListGroup.Item
                        active={selectedEntries.includes(file)}
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
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}
