import { useEffect, useRef, useState } from 'react';
import { useStore } from './store/store';
import { Button, Form } from 'react-bootstrap';
import { BsArrow90DegUp, BsFillFileMusicFill, BsPlusLg } from 'react-icons/bs';
import ListItem from './ListItem';

export default function FileBrowser() {
    const openDirectory = useStore((state) => state.fileBrowser.openDirectory);
    const currentPath = useStore((state) => state.fileBrowser.currentPath);
    const directories = useStore((state) => state.fileBrowser.directories);
    const files = useStore((state) => state.fileBrowser.files);
    const openFile = useStore((state) => state.player.open);
    const activeFile = useStore((state) => state.player.activeFile);
    const addDirectoryToPlaylist = useStore((state) => state.playlist.addDirectory);

    const filesRef = useRef<HTMLDivElement[]>([]);

    const [pathBarValue, setPathBarValue] = useState('');
    const [selectedDirectory, setSelectedDirectory] = useState('');
    const [selectedFilePath, setSelectedFilePath] = useState<string>('');
    const [showFileName, setShowFileName] = useState(false);
    const playingFrom = useStore((state) => state.player.playingFrom);

    useEffect(() => {
        setPathBarValue(currentPath);
    }, [currentPath]);

    useEffect(() => {
        filesRef.current = [];
    }, [files]);

    useEffect(() => {
        if (playingFrom === 'fileBrowser') {
            setSelectedFilePath(activeFile?.path ?? '');
        }
    }, [activeFile, playingFrom]);

    useEffect(() => {
        if (!selectedFilePath) return;
        if (filesRef.current.length === 0) return;
        const selectedRef = filesRef.current[files.findIndex((x) => x.path === selectedFilePath)];
        // @ts-ignore: non-standard method
        selectedRef?.scrollIntoViewIfNeeded();
    }, [files, selectedFilePath]);

    return (
        <div className="d-flex flex-column h-100 overflow-y-hidden">
            <div className="toolbar">
                <h6 className="text-center my-1">File browser</h6>
                <div className="d-flex px-2 mb-2">
                    <Button
                        variant="light"
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
                        variant={showFileName ? 'secondary' : 'light'}
                        onClick={() => setShowFileName(!showFileName)}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <BsFillFileMusicFill />
                    </Button>
                    <Button
                        variant="light"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                            addDirectoryToPlaylist(`${currentPath}/${selectedDirectory}`)
                        }
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <BsPlusLg />
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

            <div className="border-1 border-bottom w-100"></div>

            <div className="overflow-y-auto">
                {directories.map((directory) => (
                    <ListItem
                        isDirectory={true}
                        selected={selectedDirectory === directory}
                        onClick={() => setSelectedDirectory(directory)}
                        onDoubleClick={() => openDirectory(currentPath, directory)}
                        key={directory}
                    >
                        {directory}
                    </ListItem>
                ))}
                {files.map((file, index) => (
                    <ListItem
                        selected={file.path === selectedFilePath}
                        onClick={() => setSelectedFilePath(file.path)}
                        onDoubleClick={() => openFile(file.path, true, 'fileBrowser')}
                        ref={(el) => (filesRef.current[index] = el!)}
                        key={file.path}
                    >
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
                    </ListItem>
                ))}
            </div>
        </div>
    );
}
