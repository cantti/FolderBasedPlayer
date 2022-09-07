import { useEffect, useRef, useState } from 'react';
import { useStore } from './store/store';
import { Button, Form } from 'react-bootstrap';
import { BsArrow90DegUp } from 'react-icons/bs';

export default function FileBrowser() {
    const openDirectory = useStore((state) => state.fileBrowser.openDirectory);
    const currentPath = useStore((state) => state.fileBrowser.currentPath);
    const directories = useStore((state) => state.fileBrowser.directories);
    const files = useStore((state) => state.fileBrowser.files);

    const openFile = useStore((state) => state.player.open);
    const activeFile = useStore((state) => state.player.activeFile);

    const filesRef = useRef<HTMLDivElement[]>([]);

    const [pathBarValue, setPathBarValue] = useState('');
    const [selectedDirectory, setSelectedDirectory] = useState('');
    const [selectedFilePath, setSelectedFilePath] = useState<string>('');
    const [showFileName, setShowFileName] = useState(false);

    useEffect(() => {
        setPathBarValue(currentPath);
    }, [currentPath]);

    useEffect(() => {
        filesRef.current = [];
    }, [files]);

    useEffect(() => {
        setSelectedFilePath(activeFile?.path ?? '');
    }, [activeFile]);

    useEffect(() => {
        if (!selectedFilePath) return;
        if (filesRef.current.length === 0) return;
        const selectedRef = filesRef.current[files.findIndex((x) => x.path === selectedFilePath)];
        // @ts-ignore: non-standard method
        selectedRef.scrollIntoViewIfNeeded();
    }, [files, selectedFilePath]);

    return (
        <div className="d-flex flex-column h-100 overflow-y-hidden">
            <h6 className="text-center my-1">File browser</h6>
            <div className="p-2 pt-0 border-4 border-bottom">
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
                        onClick={() => setShowFileName(!showFileName)}
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

            <div className="overflow-y-auto">
                {directories.map((directory) => (
                    <div
                        className={`border-bottom p-2 ${
                            selectedDirectory === directory ? 'bg-primary text-light' : ''
                        }`}
                        onClick={() => setSelectedDirectory(directory)}
                        onDoubleClick={() => openDirectory(currentPath, directory)}
                        key={directory}
                    >
                        <b>{directory}</b>
                    </div>
                ))}
                {files.map((file, index) => (
                    <div
                        className={`border-bottom p-2 ${
                            file.path === selectedFilePath ? 'bg-primary text-light' : ''
                        }`}
                        onClick={() => setSelectedFilePath(file.path)}
                        onDoubleClick={() => openFile(file.path, true)}
                        ref={(el) => (filesRef.current[index] = el!)}
                        key={file.path}
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
