import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/store';
import { BsFillFileMusicFill, BsDashLg, BsTrashFill, BsSortAlphaDown, BsXLg } from 'react-icons/bs';
import { GoFileSubmodule } from 'react-icons/go';
import ListItem from './list/ListItem';
import ToolbarButton from './toolbar/ToolbarButton';
import Toolbar from './toolbar/Toolbar';
import { Button, Dropdown, Form, Spinner } from 'react-bootstrap';
import List from './list/List';
import { FileInPlayer } from '../store/FileInPlayer';
import _ from 'lodash';
import { HotKeys } from 'react-hotkeys';

export default function Playlist() {
    const files = useStore((state) => state.playlist.files);
    const open = useStore((state) => state.player.open);
    const activeFile = useStore((state) => state.player.activeFile);
    const clear = useStore((state) => state.playlist.clear);
    const remove = useStore((state) => state.playlist.remove);
    const orderBy = useStore((state) => state.playlist.orderBy);
    const isReadingMetadata = useStore((state) => state.playlist.isReadingMetadata);

    const fileBrowserIsVisible = useStore((state) => state.fileBrowser.isVisible);
    const fileBrowserToggleIsVisible = useStore((state) => state.fileBrowser.toggleIsVisible);

    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [showTags, setShowTags] = useState(true);

    const [search, setSearch] = useState('');

    const [filteredFiles, setFilteredFiles] = useState<FileInPlayer[]>([]);

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
        setFilteredFiles(filteredFiles);
        if (filteredFiles.length > 0) {
            setSelectedFiles([filteredFiles[0].id]);
        }
    }, [files, isReadingMetadata, search]);

    useEffect(() => {
        filteredFilesRef.current = filteredFilesRef.current.slice(0, filteredFiles.length);
    }, [filteredFiles]);

    useEffect(() => {
        if (!activeFile) return;
        if (filteredFilesRef.current.length === 0) return;
        const index = filteredFiles.findIndex((x) => x.id === activeFile.id);
        if (index === -1) return;
        // @ts-ignore: non-standard method
        filteredFilesRef.current[index].scrollIntoViewIfNeeded();
    }, [filteredFiles, activeFile]);

    function handleItemClick(e: React.MouseEvent<HTMLDivElement>, id: string) {
        if (e.ctrlKey) {
            if (selectedFiles.includes(id)) {
                setSelectedFiles(selectedFiles.filter((x) => x !== id));
            } else {
                setSelectedFiles([...selectedFiles, id]);
            }
        } else if (e.shiftKey) {
            if (selectedFiles.includes(id)) {
                setSelectedFiles(selectedFiles.filter((x) => x !== id));
            } else {
                const ids = files.map((x) => x.id);

                let fromId =
                    selectedFiles.length > 0
                        ? ids.filter((x) => selectedFiles.includes(x))[0]
                        : ids[0];

                const start = Math.min(ids.indexOf(fromId), ids.indexOf(id));
                const end = Math.max(ids.indexOf(fromId), ids.indexOf(id));

                setSelectedFiles(files.filter((_x, i) => i >= start && i <= end).map((x) => x.id));
            }
        } else {
            setSelectedFiles([id]);
        }
    }

    const keyMap = {
        MOVE_UP: 'up',
        ENTER: '_enter',
        MOVE_DOWN: 'down',
        SEARCH: 'Control+f',
    };

    const keyHandlers = {
        MOVE_UP: () => {
            let newSelectionIndex = -1;
            if (filteredFiles.length === 0) return;
            if (selectedFiles.length === 0) {
                newSelectionIndex = 0;
            } else {
                const oldIndex = filteredFiles.findIndex((x) => x.id === selectedFiles[0]);
                if (oldIndex > 0) {
                    newSelectionIndex = oldIndex - 1;
                }
            }
            if (newSelectionIndex > -1) {
                setSelectedFiles([filteredFiles[newSelectionIndex].id]);
                // @ts-ignore: non-standard method
                filteredFilesRef.current[newSelectionIndex].scrollIntoViewIfNeeded();
            }
        },
        MOVE_DOWN: () => {
            let newSelectionIndex = -1;
            if (filteredFiles.length === 0) return;
            if (selectedFiles.length === 0) {
                newSelectionIndex = 0;
            } else {
                const oldIndex = filteredFiles.findIndex((x) => x.id === selectedFiles[0]);
                if (oldIndex < filteredFiles.length - 1) {
                    newSelectionIndex = oldIndex + 1;
                }
            }
            if (newSelectionIndex > -1) {
                setSelectedFiles([filteredFiles[newSelectionIndex].id]);
                // @ts-ignore: non-standard method
                filteredFilesRef.current[newSelectionIndex].scrollIntoViewIfNeeded();
            }
        },
        ENTER: () => {
            if (selectedFiles.length === 0) return;
            const file = files.find((x) => x.id === selectedFiles[0]);
            if (!file) return;
            setSearch('');
            open(file.path, true, 'playlist', file.id);
        },
        SEARCH: () => {
            searchInputRef.current?.focus();
        },
    };

    return (
        <HotKeys keyMap={keyMap} handlers={keyHandlers} className="flex-grow-1 d-flex flex-column">
            <h6 className="text-center my-1">Playlist</h6>

            <Toolbar>
                <ToolbarButton
                    active={fileBrowserIsVisible}
                    onClick={fileBrowserToggleIsVisible}
                    title="Show file browser"
                >
                    <GoFileSubmodule />
                </ToolbarButton>
                <ToolbarButton
                    active={showTags}
                    onClick={() => setShowTags(!showTags)}
                    title="Show tags"
                >
                    <BsFillFileMusicFill />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => {
                        remove(selectedFiles);
                        setSelectedFiles([]);
                    }}
                    title="Remove"
                >
                    <BsDashLg />
                </ToolbarButton>
                <ToolbarButton onClick={clear} title="Clear">
                    <BsTrashFill />
                </ToolbarButton>
                <Dropdown>
                    <Dropdown.Toggle
                        variant="outline-light"
                        size="sm"
                        className="me-2"
                        id="order-by"
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <BsSortAlphaDown />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item
                            onClick={() =>
                                orderBy(
                                    (x) => x.metadata?.common.artist,
                                    (x) => x.metadata?.common.year,
                                    (x) => x.metadata?.common.album,
                                    (x) => x.metadata?.common.track.no
                                )
                            }
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            Artist, Year, Album, Track
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => orderBy((x) => x.path)}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            Path
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <div className="ms-auto">
                    {isReadingMetadata && <Spinner size="sm" animation="border" />}
                    {files.length} files
                </div>
            </Toolbar>

            <List>
                {filteredFiles.map((file, index) => (
                    <ListItem
                        selected={selectedFiles.includes(file.id)}
                        isPlaying={activeFile && activeFile.id === file.id}
                        onClick={(e) => handleItemClick(e, file.id)}
                        onDoubleClick={() => open(file.path, true, 'playlist', file.id)}
                        key={file.id}
                        ref={(el) => (filteredFilesRef.current[index] = el!)}
                        leftColumn={
                            !showTags || !file.isMetadataLoaded
                                ? file.name
                                : `${file.metadata?.common.track.no}. ${file.metadata?.common.artist} - ${file.metadata?.common.title}`
                        }
                        rightColumn={
                            showTags && file.isMetadataLoaded
                                ? `${file.metadata?.common.album} (${file.metadata?.common.year})`
                                : ''
                        }
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
