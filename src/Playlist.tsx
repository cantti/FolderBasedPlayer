import { useEffect, useRef, useState } from 'react';
import { useStore } from './store/store';
import { Button, Form } from 'react-bootstrap';
import { BsArrow90DegUp } from 'react-icons/bs';

export default function Playlist() {
    const [showFileName, setShowFileName] = useState(false);

    return (
        <div className="d-flex flex-column h-100 overflow-y-hidden">
            <h6 className="text-center my-1">Playlist</h6>

            <div className="p-2 pt-0 border-4 border-bottom">
                <div className="d-flex">
                    <Button
                        size="sm"
                        className="me-2 text-nowrap"
                        variant={showFileName ? 'dark' : 'secondary'}
                        onClick={() => setShowFileName(!showFileName)}
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        Show file names
                    </Button>
                </div>
            </div>

            <div style={{ overflowY: 'auto' }}></div>
        </div>
    );
}
