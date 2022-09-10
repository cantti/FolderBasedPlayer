import { forwardRef } from 'react';
import { MdAudiotrack } from 'react-icons/md';
import { BsFolderFill, BsPlayFill } from 'react-icons/bs';
import { Col, Row } from 'react-bootstrap';

type ListItemProps = {
    selected?: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onDoubleClick?: () => void;
    isDirectory?: boolean;
    isPlaying?: boolean;
    leftColumn?: React.ReactNode;
    rightColumn?: React.ReactNode;
};

const ListItem = forwardRef<HTMLTableRowElement, ListItemProps>((props: ListItemProps, ref) => {
    return (
        <tr
            className={`${props.selected ? 'bg-light text-dark opacity-75' : ''} ${
                props.isPlaying ? 'fw-bold' : ''
            }`}
            onClick={props.onClick}
            onDoubleClick={props.onDoubleClick}
            ref={ref}
        >
            <td>
                {props.isDirectory ? (
                    <BsFolderFill />
                ) : props.isPlaying ? (
                    <BsPlayFill />
                ) : (
                    <MdAudiotrack />
                )}
            </td>
            <td
                className="text-truncate"
                // for correct text-truncate
                style={{ maxWidth: 0 }}
                colSpan={!props.rightColumn ? 2 : 0}
            >
                {props.leftColumn}
            </td>
            {props.rightColumn && (
                <td className="text-truncate text-end" style={{ maxWidth: 0 }}>
                    {props.rightColumn}
                </td>
            )}
        </tr>
    );
});

export default ListItem;
