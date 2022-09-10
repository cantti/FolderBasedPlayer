import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/store';
import { Dropdown, Form, Button } from 'react-bootstrap';
import {
    BsArrow90DegUp,
    BsFillFileMusicFill,
    BsPlusLg,
    BsFillHeartFill,
    BsDashLg,
} from 'react-icons/bs';
import ListItem from './misc/ListItem';
import CustomScrollbars from './misc/CustomScrollbars';
import Toolbar from './toolbar/Toolbar';
import ToolbarButton from './toolbar/ToolbarButton';

export default function FileBrowser() {
    const openDirectory = useStore((state) => state.fileBrowser.openDirectory);
    const currentPath = useStore((state) => state.fileBrowser.currentPath);
    const directories = useStore((state) => state.fileBrowser.directories);
    const files = useStore((state) => state.fileBrowser.files);

    const bookmarks = useStore((state) => state.fileBrowser.bookmarks);
    const addBookmark = useStore((state) => state.fileBrowser.addBookmark);
    const removeBookmark = useStore((state) => state.fileBrowser.removeBookmark);

    const openFile = useStore((state) => state.player.open);
    const activeFile = useStore((state) => state.player.activeFile);
    const addDirectoryToPlaylist = useStore((state) => state.playlist.addDirectory);
    const addFilesToPlaylist = useStore((state) => state.playlist.addFiles);

    const filesRef = useRef<HTMLDivElement[]>([]);

    const [pathBarValue, setPathBarValue] = useState('');
    const [selections, setSelections] = useState<string[]>([]);
    const [showTags, setShowTags] = useState(true);

    useEffect(() => {
        setPathBarValue(currentPath);
    }, [currentPath]);

    useEffect(() => {
        filesRef.current = filesRef.current.slice(0, files.length);
    }, [files]);

    useEffect(() => {
        if (!activeFile) return;
        if (filesRef.current.length === 0) return;
        const index = files.findIndex((x) => x.id === activeFile.id);
        if (index === -1) return;
        // @ts-ignore: non-standard method
        filesRef.current[index].scrollIntoViewIfNeeded();
    }, [files, activeFile]);

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
        <div className="d-flex flex-column flex-grow-1">
            <div className="toolbar">
                <h6 className="text-center my-1">File browser</h6>

                <Toolbar>
                    <ToolbarButton
                        onClick={() => openDirectory(`${currentPath}/..`)}
                        title="Open parent"
                    >
                        <BsArrow90DegUp />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => setShowTags(!showTags)} title="Show tags">
                        <BsFillFileMusicFill />
                    </ToolbarButton>
                    <ToolbarButton onClick={handleAddToPlaylistClick} title="Add to playlist">
                        <BsPlusLg />
                    </ToolbarButton>
                    <Dropdown>
                        <Dropdown.Toggle
                            variant="outline-light"
                            size="sm"
                            className="me-2"
                            id="bookmarks"
                        >
                            <BsFillHeartFill />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => addBookmark(currentPath)}>
                                Add
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            {bookmarks.map((bookmark, index) => (
                                <Dropdown.Item
                                    key={index}
                                    className="d-flex justify-content-between align-items-center"
                                >
                                    <div onClick={() => openDirectory(bookmark)}>{bookmark}</div>
                                    <Button
                                        size="sm"
                                        className="ms-2"
                                        variant="outline-danger"
                                        title="Remove"
                                        onClick={() => removeBookmark(bookmark)}
                                    >
                                        <BsDashLg />
                                    </Button>
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
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
                </Toolbar>
            </div>

            <CustomScrollbars>
                {directories.map((directory) => (
                    <ListItem
                        isDirectory={true}
                        selected={selections.includes(directory.id)}
                        onClick={(e) => handleItemClick(e, directory.id)}
                        onDoubleClick={() => openDirectory(directory.path)}
                        key={directory.id}
                        leftColumn={directory.name}
                    />
                ))}
                {files.map((file, index) => (
                    <ListItem
                        selected={selections.includes(file.id)}
                        onClick={(e) => handleItemClick(e, file.id)}
                        onDoubleClick={() => openFile(file.path, true, 'fileBrowser', file.id)}
                        ref={(el) => (filesRef.current[index] = el!)}
                        key={file.path}
                        isPlaying={activeFile && activeFile.id === file.id}
                        leftColumn={
                            !showTags || !file.isMetadataLoaded
                                ? file.name
                                : `${file.metadata?.common.artist} - ${file.metadata?.common.title}`
                        }
                        rightColumn={
                            showTags && file.isMetadataLoaded
                                ? `${file.metadata?.common.album} (${file.metadata?.common.year})`
                                : ''
                        }
                    />
                ))}
            </CustomScrollbars>
        </div>
    );
}
