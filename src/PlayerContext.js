import { createContext, useState, useRef, useEffect } from "react";
import { Howl, Howler } from "howler";

export const PlayerContext = createContext(null);

export default function PlayerProvider({ children }) {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [metadata, setMetadata] = useState(null);
  const [pathDetails, setPathDetails] = useState(null);

  const howl = useRef(null);

  async function play(path) {
    if (howl.current) {
      howl.current.unload();
    }
    howl.current = new Howl({
      src: ["atom://" + path],
      onload: () => {
        setDuration(howl.current.duration());
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPosition(howl.current ? Math.round(howl.current.seek()) : 0);
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
        metadata,
        pathDetails,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
