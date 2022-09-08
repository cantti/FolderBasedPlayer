import { forwardRef } from 'react';
import { MdAudiotrack } from 'react-icons/md';
import { BsFolderFill, BsPlayFill } from 'react-icons/bs';

type ListItemProps = {
    selected?: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onDoubleClick?: () => void;
    children?: React.ReactNode;
    isDirectory?: boolean;
    isPlaying?: boolean;
};

const ListItem = forwardRef<HTMLDivElement, ListItemProps>((props: ListItemProps, ref) => {
    return (
        <div
            className={`border-bottom border-1 p-2 d-flex align-items-center ${
                props.selected ? 'bg-light text-dark' : ''
            } ${props.isPlaying ? 'fw-bold' : ''}`}
            onClick={props.onClick}
            onDoubleClick={props.onDoubleClick}
            ref={ref}
        >
            <div className="me-2">
                {props.isDirectory ? (
                    <BsFolderFill />
                ) : props.isPlaying ? (
                    <BsPlayFill />
                ) : (
                    <MdAudiotrack />
                )}
            </div>
            <div
                className="flex-grow-1 d-flex"
                // without it ellipsis not work
                style={{ minWidth: 0 }}
            >
                {props.children}
            </div>
        </div>
    );
});

export default ListItem;
