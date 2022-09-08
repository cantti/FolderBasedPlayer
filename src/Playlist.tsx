import { useEffect, useRef, useState } from 'react';
import { useStore } from './store/store';
import { Button } from 'react-bootstrap';
import { BsFillFileMusicFill, BsDashLg } from 'react-icons/bs';
import ListItem from './ListItem';
import Scrollbars from 'react-custom-scrollbars-2';
import CustomScrollbars from './CustomScrollbars';

export default function Playlist() {
    const files = useStore((state) => state.playlist.files);
    const open = useStore((state) => state.player.open);
    const activeFile = useStore((state) => state.player.activeFile);
    const clear = useStore((state) => state.playlist.clear);
    const remove = useStore((state) => state.playlist.remove);

    const [showFileName, setShowFileName] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

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
        <div className="d-flex flex-column h-100 overflow-y-hidden">
            <h6 className="text-center my-1">Playlist</h6>

            <div className="p-2 pt-0">
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
                    size="sm"
                    className="me-2 text-nowrap"
                    variant={'outline-light'}
                    onClick={() => {
                        remove(selectedFiles);
                        setSelectedFiles([]);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <BsDashLg />
                </Button>
                <Button
                    size="sm"
                    className="me-2 text-nowrap"
                    variant={'outline-light'}
                    onClick={clear}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    Clear
                </Button>
            </div>

            <div className="border-1 border-bottom w-100"></div>

            <CustomScrollbars>
                {files.map((file, index) => (
                    <ListItem
                        selected={selectedFiles.includes(file.id)}
                        isPlaying={activeFile && activeFile.id === file.id}
                        onClick={(e) => handleItemClick(e, file.id)}
                        onDoubleClick={() => open(file.path, true, 'playlist', file.id)}
                        key={file.id}
                        ref={(el) => (filesRef.current[index] = el!)}
                    >
                        {!file.isMetadataLoaded ? (
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
            </CustomScrollbars>
        </div>
    );
}
