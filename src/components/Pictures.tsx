import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Image } from 'react-bootstrap';

export default function Pictures() {
    const { path } = useParams();
    const [picture, setPicture] = useState('');
    useEffect(() => {
        (async () => {
            if (!path) return;

            const metadata = await window.electron.readMetadata(path);
            setPicture(metadata.picture);
            
            // calculate image size and resize window
            const tmpImage = new window.Image();
            tmpImage.src = metadata.picture;
            await tmpImage.decode();
            window.resizeTo(tmpImage.width + 100, tmpImage.height + 100);
        })();
    }, [path]);
    return (
        <div
            className="d-flex justify-content-center align-items-center bg-dark"
            style={{ height: '100vh' }}
        >
            <Image src={picture} />
        </div>
    );
}
