import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/store';
import { BsFillFileMusicFill, BsDashLg, BsTrashFill, BsSortAlphaDown } from 'react-icons/bs';
import ListItem from './list/ListItem';
import ToolbarButton from './toolbar/ToolbarButton';
import Toolbar from './toolbar/Toolbar';
import { Dropdown, Spinner } from 'react-bootstrap';
import List from './list/List';

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

    const filesRef = useRef<HTMLDivElement[]>([]);

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
                {files.map((file, index) => (
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
        </div>
    );
}
