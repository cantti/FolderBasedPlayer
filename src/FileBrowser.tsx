import { useEffect, useRef, useState } from 'react';
import { useStore } from './store/store';
import { Button, Form } from 'react-bootstrap';
import { BsArrow90DegUp, BsFillFileMusicFill, BsPlusLg } from 'react-icons/bs';
import ListItem from './ListItem';
import { FileInPlayer } from './store/FileInPlayer';
import { DirectoryInPlayer } from './store/file-browser/FileBrowserSlice';

export default function FileBrowser() {
    const openDirectory = useStore((state) => state.fileBrowser.openDirectory);
    const currentPath = useStore((state) => state.fileBrowser.currentPath);
    const directories = useStore((state) => state.fileBrowser.directories);
    const files = useStore((state) => state.fileBrowser.files);
    const openFile = useStore((state) => state.player.open);
    const activeFile = useStore((state) => state.player.activeFile);
    const addDirectoryToPlaylist = useStore((state) => state.playlist.addDirectory);
    const addFilesToPlaylist = useStore((state) => state.playlist.addFiles);

    const filesRef = useRef<HTMLDivElement[]>([]);

    const [pathBarValue, setPathBarValue] = useState('');
    const [selections, setSelections] = useState<string[]>([]);
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
            setSelections([activeFile?.id ?? '']);
        }
    }, [activeFile, playingFrom]);

    // useEffect(() => {
    //     if (!selectedFilePath) return;
    //     if (filesRef.current.length === 0) return;
    //     const selectedRef = filesRef.current[files.findIndex((x) => x.id === selectedFilePath)];
    //     // @ts-ignore: non-standard method
    //     selectedRef?.scrollIntoViewIfNeeded();
    // }, [files, selectedFilePath]);

    function handleItemClick(e: React.MouseEvent<HTMLDivElement>, id: string) {
        if (e.ctrlKey) {
            if (selections.includes(id)) {
                setSelections(selections.filter((x) => x !== id));
            } else {
                setSelections([...selections, id]);
            }
        } else if (e.shiftKey) {
            if (selections.includes(id)) {
                setSelections(selections.filter((x) => x !== id));
            } else {
                const ids = [...directories.map((x) => x.id), ...files.map((x) => x.id)];

                let fromId =
                    selections.length > 0 ? ids.filter((x) => selections.includes(x))[0] : ids[0];

                const start = Math.min(ids.indexOf(fromId), ids.indexOf(id));
                const end = Math.max(ids.indexOf(fromId), ids.indexOf(id));

                setSelections(ids.filter((_x, i) => i >= start && i <= end));
            }
        } else {
            setSelections([id]);
        }
    }

    async function handleAddToPlaylistClick() {
        for (const id of selections) {
            const dir = directories.find((x) => x.id === id);
            if (dir) {
                await addDirectoryToPlaylist(`${currentPath}/${dir.name}`);
            } else {
                const file = files.find((x) => x.id === id);
                if (file) {
                    await addFilesToPlaylist([file?.path]);
                }
            }
        }
    }

    return (
        <div className="d-flex flex-column h-100 overflow-y-hidden">
            <div className="toolbar">
                <h6 className="text-center my-1">File browser</h6>
                <div className="d-flex px-2 mb-2">
                    <Button
                        variant="outline-light"
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
                        variant={showFileName ? 'outline-secondary' : 'outline-light'}
                        onClick={() => setShowFileName(!showFileName)}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <BsFillFileMusicFill />
                    </Button>
                    <Button
                        variant="outline-light"
                        size="sm"
                        className="me-2"
                        onClick={handleAddToPlaylistClick}
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
                        className="bg-transparent text-light"
                    />
                </div>
            </div>

            <div className="border-1 border-bottom w-100"></div>

            <div className="overflow-y-auto">
                {directories.map((directory) => (
                    <ListItem
                        isDirectory={true}
                        selected={selections.includes(directory.id)}
                        onClick={(e) => handleItemClick(e, directory.id)}
                        onDoubleClick={() => openDirectory(currentPath, directory.name)}
                        key={directory.id}
                    >
                        {directory.name}
                    </ListItem>
                ))}
                {files.map((file, index) => (
                    <ListItem
                        selected={selections.includes(file.id)}
                        onClick={(e) => handleItemClick(e, file.id)}
                        onDoubleClick={() => openFile(file.path, true, 'fileBrowser', file.id)}
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
