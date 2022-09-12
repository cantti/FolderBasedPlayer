import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/store';
import { BsFillFileMusicFill, BsDashLg, BsTrashFill, BsSortAlphaDown, BsXLg } from 'react-icons/bs';
import ListItem from './list/ListItem';
import ToolbarButton from './toolbar/ToolbarButton';
import Toolbar from './toolbar/Toolbar';
import { Button, Dropdown, Form, Spinner } from 'react-bootstrap';
import List from './list/List';
import { FileInPlayer } from '../store/FileInPlayer';
import _ from 'lodash';

export default function Playlist() {
    const files = useStore((state) => state.playlist.files);
    const open = useStore((state) => state.player.open);
    const activeFile = useStore((state) => state.player.activeFile);
    const clear = useStore((state) => state.playlist.clear);
    const remove = useStore((state) => state.playlist.remove);
    const orderBy = useStore((state) => state.playlist.orderBy);
    const isReadingMetadata = useStore((state) => state.playlist.isReadingMetadata);

    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [showTags, setShowTags] = useState(true);

    const [search, setSearch] = useState('');

    const [filteredFiles, setFilteredFiles] = useState<FileInPlayer[]>([]);

    const filesRef = useRef<HTMLDivElement[]>([]);

    const searchTimeoutRef = useRef<number>();

    useEffect(() => {
        clearTimeout(searchTimeoutRef.current);
        if (!search) {
            setFilteredFiles(files);
            return;
        }
        const callback = () => {
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
                return _.every(words, (word) =>
                    _.some(tags, (tag) => tag?.includes(word) ?? false)
                );
            });
            setFilteredFiles(filteredFiles);
        };
        setTimeout(callback, 1000);
    }, [files, search]);

    useEffect(() => {
        filesRef.current = filesRef.current.slice(0, filteredFiles.length);
    }, [filteredFiles]);

    useEffect(() => {
        if (!activeFile) return;
        if (filesRef.current.length === 0) return;
        const index = filteredFiles.findIndex((x) => x.id === activeFile.id);
        if (index === -1) return;
        // @ts-ignore: non-standard method
        filesRef.current[index].scrollIntoViewIfNeeded();
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

    return (
        <div className="flex-grow-1 d-flex flex-column">
            <h6 className="text-center my-1">Playlist</h6>

            <Toolbar>
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
                        ref={(el) => (filesRef.current[index] = el!)}
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
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="sm"
                    className="bg-transparent text-light me-2"
                    placeholder="Search..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (filteredFiles.length > 0) {
                                const file = filteredFiles[0];
                                open(file.path, true, 'playlist', file.id);
                                setSelectedFiles([file.id]);
                                setSearch('');
                            }
                        }
                    }}
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
        </div>
    );
}
