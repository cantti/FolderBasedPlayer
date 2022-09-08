import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/store';
import { BsFillFileMusicFill, BsDashLg, BsTrashFill } from 'react-icons/bs';
import ListItem from './misc/ListItem';
import CustomScrollbars from './misc/CustomScrollbars';
import ToolbarButton from './toolbar/ToolbarButton';
import Toolbar from './toolbar/Toolbar';

export default function Playlist() {
    const files = useStore((state) => state.playlist.files);
    const open = useStore((state) => state.player.open);
    const activeFile = useStore((state) => state.player.activeFile);
    const clear = useStore((state) => state.playlist.clear);
    const remove = useStore((state) => state.playlist.remove);

    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [showTags, setShowTags] = useState(true);

    const filesRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        filesRef.current = [];
    }, [files]);

    useEffect(() => {
        if (!activeFile) return;
        if (filesRef.current.length === 0) return;
        const selectedRef = filesRef.current[files.findIndex((x) => x.id === activeFile.id)];
        // @ts-ignore: non-standard method
        selectedRef?.scrollIntoViewIfNeeded();
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
            </Toolbar>

            {/* <div className="border-1 border-bottom w-100"></div> */}

            <CustomScrollbars>
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
