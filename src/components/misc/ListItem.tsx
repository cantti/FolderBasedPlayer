import { forwardRef } from 'react';
import { MdAudiotrack } from 'react-icons/md';
import { BsFolderFill, BsPlayFill } from 'react-icons/bs';

type ListItemProps = {
    selected?: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onDoubleClick?: () => void;
    isDirectory?: boolean;
    isPlaying?: boolean;
    leftColumn?: React.ReactNode;
    rightColumn?: React.ReactNode;
};

const ListItem = forwardRef<HTMLDivElement, ListItemProps>((props: ListItemProps, ref) => {
    return (
        <div
            className={`border-bottom border-1 p-2 d-flex align-items-center ${
                props.selected ? 'bg-light text-dark opacity-75' : ''
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
            <div className="flex-grow-1 d-flex overflow-hidden">
                <div className="text-truncate">{props.leftColumn}</div>
                <div className="text-truncate ms-auto ps-4">{props.rightColumn}</div>
            </div>
        </div>
    );
});

export default ListItem;
