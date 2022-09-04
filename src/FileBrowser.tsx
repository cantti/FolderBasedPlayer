import { useEffect, useRef, useState } from 'react';
import { useStore } from './store/store';
import { ButtonGroup, Button, Form, ListGroup, Navbar } from 'react-bootstrap';
import { BsArrow90DegUp } from 'react-icons/bs';
import { FileInBrowser } from './store/FileBrowserSlice';

export default function FileBrowser() {
    const {
        openDirectory,
        currentPath,
        showFileName,
        toggleShowFileName,
        loadMetadata,
        directories,
        files,
        resetShuffle,
    } = useStore((state) => state.fileBrowser);

    const playFromFileBrowser = useStore((state) => state.player.playFile);
    const activeFile = useStore((state) => state.player.activeFile);

    const filesRef = useRef<HTMLDivElement[]>([]);

    const [pathBarValue, setPathBarValue] = useState('');
    const [selectedDirectory, setSelectedDirectory] = useState('');
    const [selectedFile, setSelectedFile] = useState<FileInBrowser | undefined>(undefined);

    useEffect(() => {
        setPathBarValue(currentPath);
    }, [currentPath]);

    useEffect(() => {
        filesRef.current = [];
    }, [files]);

    useEffect(() => {
        setSelectedFile(activeFile);
    }, [activeFile]);

    useEffect(() => {
        openDirectory('/run/media/cantti/Backup_Silver/music/Reggae/Dub Artists/Alpha & Omega/');
    }, [openDirectory]);

    useEffect(() => {
        loadMetadata();
    }, [loadMetadata, files, showFileName]);

    useEffect(() => {
        if (!selectedFile) return;
        const selectedRef = filesRef.current[files.indexOf(selectedFile)];
        if (!selectedRef) return;
        // @ts-ignore: non-standard method
        selectedRef.scrollIntoViewIfNeeded();
    }, [files, selectedFile]);

    return (
        <div className="d-flex flex-column" style={{ overflowY: 'hidden' }}>
            <div className="p-2 border-4 border-bottom">
                <div className="d-flex">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => openDirectory(currentPath, '..')}
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
                    <Form.Control
                        type="text"
                        value={pathBarValue}
                        onChange={(e) => setPathBarValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                openDirectory(pathBarValue);
                            }
                        }}
                        size="sm"
                    />
                </div>
            </div>

            <div style={{ overflowY: 'auto' }}>
                {directories.map((directory) => (
                    <div
                        className={`border-bottom p-2 ${
                            selectedDirectory === directory ? 'bg-primary text-light' : ''
                        }`}
                        onClick={() => setSelectedDirectory(directory)}
                        onDoubleClick={() => openDirectory(currentPath, directory)}
                    >
                        <b>{directory}</b>
                    </div>
                ))}
                {files.map((file, index) => (
                    <div
                        className={`border-bottom p-2 ${
                            file.path === selectedFile?.path ? 'bg-primary text-light' : ''
                        }`}
                        onClick={() => setSelectedFile(file)}
                        onDoubleClick={() => playFromFileBrowser(file)}
                        ref={(el) => (filesRef.current[index] = el!)}
                    >
                        <div className="media-body" style={{ display: 'flex' }}>
                            {showFileName || !file.isMetadataLoaded ? (
                                file.name
                            ) : (
                                <>
                                    <div className="text-truncate">{`${file.metadata?.common.artist} - ${file.metadata?.common.title}`}</div>
                                    <div className="text-nowrap ms-auto ps-4">
                                        {`${file.metadata?.common.album} (${file.metadata?.common.year})`}
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
