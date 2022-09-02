import { createContext, useState, useRef, useEffect } from 'react';
import { Howl, Howler } from 'howler';

export const PlayerContext = createContext(null);

export default function PlayerProvider({ children }) {
    const [currentPosition, setCurrentPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [metadata, setMetadata] = useState(null);
    const [pathDetails, setPathDetails] = useState(null);
    const [playlist, setPlaylist] = useState([]);

    const howl = useRef(null);

    async function addFilesToPlaylist(files) {
        setPlaylist(files);
    }

    async function play(path) {
        if (howl.current) {
            howl.current.unload();
        }
        howl.current = new Howl({
            src: ['atom://' + path],
            onload: () => {
                setDuration(howl.current.duration());
            },
            onplay: () => {
                setIsPlaying(true);
            },
            onpause: () => {
                setIsPlaying(false);
            },
            onend: () => {
                setIsPlaying(false);
            },
            onstop: () => {
                setIsPlaying(false);
            },
        });
        howl.current.play();
        const metadata = await window.electron.readMetadata(path);
        setMetadata(metadata);
        const pathDetails = await window.electron.getPathDetails(path);
        setPathDetails(pathDetails);
    }

    function setPosition(position) {
        if (!howl.current) return;
        howl.current.seek(position);
    }

    function playPause() {
        if (!howl.current) return;
        if (howl.current.playing()) {
            howl.current.pause();
        } else {
            howl.current.play();
        }
    }

    function stop() {
        if (!howl.current) return;
        howl.current.stop();
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPosition(
                howl.current ? Math.round(howl.current.seek()) : 0
            );
        }, 100);
        return () => clearInterval(interval);
    }, []);

    return (
        <PlayerContext.Provider
            value={{
                play,
                position: currentPosition,
                setPosition,
                duration,
                isPlaying,
                playPause,
                stop,
                metadata,
                pathDetails,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}
