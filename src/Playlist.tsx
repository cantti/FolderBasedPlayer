import { useEffect, useRef, useState } from 'react';
import { useStore } from './store/store';
import { Button, Form } from 'react-bootstrap';
import { BsArrow90DegUp, BsFillFileMusicFill, BsDashLg } from 'react-icons/bs';
import ListItem from './ListItem';
import { FileInPlaylist } from './store/playlist/PlaylistSlice';

export default function Playlist() {
    const files = useStore((state) => state.playlist.files);
    const open = useStore((state) => state.player.open);
    const activeFile = useStore((state) => state.player.activeFile);
    const playingFrom = useStore((state) => state.player.playingFrom);
    const clear = useStore((state) => state.playlist.clear);

    const [showFileName, setShowFileName] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<FileInPlaylist[]>([]);

    const filesRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        if (playingFrom === 'playlist' && activeFile) {
            const file = files.find((x) => x.path === activeFile.path);
            if (file) {
                setSelectedFiles([file]);
            }
        }
    }, [activeFile, files, playingFrom]);

    useEffect(() => {
        filesRef.current = [];
    }, [files]);

    // useEffect(() => {
    //     if (!selectedFilePath) return;
    //     if (filesRef.current.length === 0) return;
    //     const selectedRef = filesRef.current[files.findIndex((x) => x.path === selectedFilePath)];
    //     // @ts-ignore: non-standard method
    //     selectedRef?.scrollIntoViewIfNeeded();
    // }, [files, selectedFilePath]);

    function handleItemClick(e: React.MouseEvent<HTMLDivElement>, file: FileInPlaylist) {
        if (e.ctrlKey) {
            if (selectedFiles.includes(file)) {
                setSelectedFiles(selectedFiles.filter((x) => x !== file));
            } else {
                setSelectedFiles([...selectedFiles, file]);
            }
        } else if (e.shiftKey) {
            if (selectedFiles.includes(file)) {
                setSelectedFiles(selectedFiles.filter((x) => x !== file));
            } else {
                let fromFile =
                    selectedFiles.length > 0
                        ? files.filter((x) => selectedFiles.includes(x))[0]
                        : files[0];

                const start = Math.min(files.indexOf(fromFile), files.indexOf(file));
                const end = Math.max(files.indexOf(fromFile), files.indexOf(file));

                setSelectedFiles(files.filter((_x, i) => i >= start && i <= end));
            }
        } else {
            setSelectedFiles([file]);
        }
    }

    return (
        <div className="d-flex flex-column h-100 overflow-y-hidden">
            <h6 className="text-center my-1">Playlist</h6>

            <div className="p-2 pt-0">
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
                    size="sm"
                    className="me-2 text-nowrap"
                    variant={'light'}
                    // onClick={() => setShowFileName(!showFileName)}
                    // onMouseDown={(e) => e.preventDefault()}
                >
                    <BsDashLg />
                </Button>
                <Button
                    size="sm"
                    className="me-2 text-nowrap"
                    variant={'light'}
                    onClick={clear}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    Clear
                </Button>
            </div>

            <div className="border-1 border-bottom w-100"></div>

            <div className="overflow-y-auto">
                {files.map((file, index) => (
                    <ListItem
                        selected={selectedFiles.includes(file)}
                        onClick={(e) => handleItemClick(e, file)}
                        onDoubleClick={() => open(file.path, true, 'playlist')}
                        key={index}
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
            </div>
        </div>
    );
}
