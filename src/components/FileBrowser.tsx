import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/store';
import { Dropdown, Form, Button } from 'react-bootstrap';
import {
    BsArrow90DegUp,
    BsFillFileMusicFill,
    BsPlusLg,
    BsFillHeartFill,
    BsDashLg,
    BsXLg,
} from 'react-icons/bs';
import ListItem from './list/ListItem';
import Toolbar from './toolbar/Toolbar';
import ToolbarButton from './toolbar/ToolbarButton';
import List from './list/List';
import { HotKeys } from 'react-hotkeys';
import _ from 'lodash';
import { FileInPlayer } from '../store/FileInPlayer';
import { DirectoryInPlayer } from '../store/file-browser/FileBrowserSlice';
import { formatTitle, leftColFormatStr, rightColFormatStr } from '../formatTitle';

export default function FileBrowser() {
    const openDirectory = useStore((state) => state.fileBrowser.openDirectory);
    const isReadingMetadata = useStore((state) => state.fileBrowser.isReadingMetadata);
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

    const [pathBarValue, setPathBarValue] = useState('');
    const [filteredFiles, setFilteredFiles] = useState<FileInPlayer[]>([]);
    const [filteredDirectories, setFilteredDirectories] = useState<DirectoryInPlayer[]>([]);
    const [selections, setSelections] = useState<string[]>([]);
    const [showTags, setShowTags] = useState(true);
    const [search, setSearch] = useState('');

    const filteredFilesRef = useRef<HTMLDivElement[]>([]);
    const searchTimeoutRef = useRef<number>();
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        clearTimeout(searchTimeoutRef.current);
        if (isReadingMetadata) {
            return;
        }
        if (!search) {
            setFilteredFiles(files);
            setFilteredDirectories(directories);
            return;
        }
        const words = search.toLowerCase().split(' ');
        const filteredFiles = files.filter((file) => {
            const common = file.metadata?.common;
            const tags = [
                common?.artist,
                common?.title,
                common?.album,
                common?.year?.toString(),
                file.name,
            ].map((x) => x?.toLowerCase());
            return _.every(words, (word) => _.some(tags, (tag) => tag?.includes(word) ?? false));
        });
        const filteredDirectories = directories.filter((directory) => {
            return _.every(words, (word) => directory.name.toLowerCase().includes(word));
        });
        setFilteredFiles(filteredFiles);
        setFilteredDirectories(filteredDirectories);
        if (filteredFiles.length > 0) {
            setSelections([filteredFiles[0].id]);
        } else if (filteredDirectories.length > 0) {
            setSelections([filteredDirectories[0].id]);
        }
    }, [directories, files, isReadingMetadata, search]);

    useEffect(() => {
        setPathBarValue(currentPath);
        setSelections([]);
    }, [currentPath]);

    useEffect(() => {
        filteredFilesRef.current = filteredFilesRef.current.slice(0, filteredFiles.length);
    }, [filteredFiles]);

    useEffect(() => {
        if (!activeFile) return;
        if (filteredFilesRef.current.length === 0) return;
        const index = files.findIndex((x) => x.id === activeFile.id);
        if (index === -1) return;
        // @ts-ignore: non-standard method
        filteredFilesRef.current[index].scrollIntoViewIfNeeded();
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
        if (selections.length === 0) {
            await addFilesToPlaylist(filteredFiles.map((x) => x.path));
        } else {
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
    }

    const keyMap = {
        MOVE_UP: 'up',
        ENTER: '_enter',
        MOVE_DOWN: 'down',
        SEARCH: 'Control+f',
        PARENT: 'Backspace',
    };

    const keyHandlers = {
        MOVE_UP: () => {
            let newSelectionIndex = -1;
            if (filteredFiles.length === 0 && filteredDirectories.length === 0) return;
            if (selections.length === 0) {
                newSelectionIndex = 0;
            } else {
                const ids = [
                    ...filteredDirectories.map((x) => x.id),
                    ...filteredFiles.map((x) => x.id),
                ];
                let oldIndex = ids.indexOf(selections[0]);
                if (oldIndex > 0) {
                    newSelectionIndex = oldIndex - 1;
                }
            }
            if (newSelectionIndex !== -1) {
                if (newSelectionIndex < filteredDirectories.length) {
                    setSelections([filteredDirectories[newSelectionIndex].id]);
                } else {
                    setSelections([
                        filteredFiles[newSelectionIndex - filteredDirectories.length].id,
                    ]);
                    // @ts-ignore: non-standard method
                    filteredFilesRef.current[newSelectionIndex].scrollIntoViewIfNeeded();
                }
            }
        },
        MOVE_DOWN: () => {
            let newSelectionIndex = -1;
            if (filteredFiles.length === 0 && filteredDirectories.length === 0) return;
            if (selections.length === 0) {
                newSelectionIndex = 0;
            } else {
                const ids = [
                    ...filteredDirectories.map((x) => x.id),
                    ...filteredFiles.map((x) => x.id),
                ];
                let oldIndex = ids.indexOf(selections[0]);
                if (oldIndex < ids.length - 1) {
                    newSelectionIndex = oldIndex + 1;
                }
            }
            if (newSelectionIndex !== -1) {
                if (newSelectionIndex < filteredDirectories.length) {
                    setSelections([filteredDirectories[newSelectionIndex].id]);
                } else {
                    setSelections([
                        filteredFiles[newSelectionIndex - filteredDirectories.length].id,
                    ]);
                    // @ts-ignore: non-standard method
                    filteredFilesRef.current[newSelectionIndex].scrollIntoViewIfNeeded();
                }
            }
        },
        ENTER: () => {
            if (selections.length === 0) return;
            const file = files.find((x) => x.id === selections[0]);
            if (file) {
                openFile(file.path, true, 'playlist', file.id);
            } else {
                const directory = directories.find((x) => x.id === selections[0]);
                if (directory) {
                    openDirectory(directory.path);
                }
            }
            setSearch('');
        },
        SEARCH: () => {
            searchInputRef.current?.focus();
        },
        PARENT: () => {
            openDirectory(`${currentPath}/..`);
        },
    };

    return (
        <HotKeys keyMap={keyMap} handlers={keyHandlers} className="d-flex flex-column flex-grow-1">
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
                        onMouseDown={(e) => e.preventDefault()}
                        title="Bookmarks"
                    >
                        <BsFillHeartFill />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => addBookmark(currentPath)}>Add</Dropdown.Item>
                        <Dropdown.Divider />
                        {bookmarks.map((bookmark, index) => (
                            <Dropdown.Item
                                key={index}
                                className="d-flex justify-content-between align-items-center"
                                onMouseDown={(e) => e.preventDefault()}
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

            <List>
                {filteredDirectories.map((directory) => (
                    <ListItem
                        isDirectory={true}
                        selected={selections.includes(directory.id)}
                        onClick={(e) => handleItemClick(e, directory.id)}
                        onDoubleClick={() => openDirectory(directory.path)}
                        key={directory.id}
                        leftColumn={directory.name}
                    />
                ))}
                {filteredFiles.map((file, index) => (
                    <ListItem
                        selected={selections.includes(file.id)}
                        onClick={(e) => handleItemClick(e, file.id)}
                        onDoubleClick={() => openFile(file.path, true, 'fileBrowser', file.id)}
                        ref={(el) => (filteredFilesRef.current[index] = el!)}
                        key={file.path}
                        isPlaying={activeFile && activeFile.id === file.id}
                        leftColumn={showTags ? formatTitle(file, leftColFormatStr) : file.name}
                        rightColumn={showTags ? formatTitle(file, rightColFormatStr) : ''}
                    />
                ))}
            </List>

            <div className="p-2 d-flex">
                <Form.Control
                    ref={searchInputRef}
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                            setSearch('');
                        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                            e.preventDefault();
                        }
                    }}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="sm"
                    className="bg-transparent text-light me-2"
                    placeholder="Search..."
                />
                <Button
                    size="sm"
                    variant="outline-light"
                    onClick={() => setSearch('')}
                    onMouseDown={(e) => e.preventDefault()}
                    title={'Clear'}
                >
                    <BsXLg />
                </Button>
            </div>
        </HotKeys>
    );
}
