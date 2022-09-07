import { useEffect, useRef, useState } from 'react';
import { useStore } from './store/store';
import { Button, Form } from 'react-bootstrap';
import { BsArrow90DegUp, BsFillFileMusicFill, BsDashLg } from 'react-icons/bs';
import ListItem from './ListItem';

export default function Playlist() {
    const files = useStore((state) => state.playlist.files);
    const open = useStore((state) => state.player.open);
    const activeFile = useStore((state) => state.player.activeFile);
    const playingFrom = useStore((state) => state.player.playingFrom);

    const [selectedFilePath, setSelectedFilePath] = useState<string>('');
    const [showFileName, setShowFileName] = useState(false);

    const filesRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        if (playingFrom === 'playlist') {
            setSelectedFilePath(activeFile?.path ?? '');
        }
    }, [activeFile, playingFrom]);

    useEffect(() => {
        filesRef.current = [];
    }, [files]);

    useEffect(() => {
        if (!selectedFilePath) return;
        if (filesRef.current.length === 0) return;
        const selectedRef = filesRef.current[files.findIndex((x) => x.path === selectedFilePath)];
        // @ts-ignore: non-standard method
        selectedRef?.scrollIntoViewIfNeeded();
    }, [files, selectedFilePath]);

    return (
        <div className="d-flex flex-column h-100 overflow-y-hidden">
            <h6 className="text-center my-1">Playlist</h6>

            <div className="p-2 pt-0 border-4 border-bottom">
                <Button
                    size="sm"
                    className="me-2 text-nowrap"
                    variant={showFileName ? 'dark' : 'secondary'}
                    onClick={() => setShowFileName(!showFileName)}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    <BsFillFileMusicFill />
                </Button>
                <Button
                    size="sm"
                    className="me-2 text-nowrap"
                    variant={'secondary'}
                    // onClick={() => setShowFileName(!showFileName)}
                    // onMouseDown={(e) => e.preventDefault()}
                >
                    <BsDashLg />
                </Button>
            </div>

            <div className="overflow-y-auto">
                {files.map((file, index) => (
                    <ListItem
                        selected={file.path === selectedFilePath}
                        onClick={() => setSelectedFilePath(file.path)}
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
