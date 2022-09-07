import { forwardRef } from 'react';

type ListItemProps = {
    selected?: boolean;
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onDoubleClick?: () => void;
    children?: React.ReactNode;
    isDirectory?: boolean;
};

const ListItem = forwardRef<HTMLDivElement, ListItemProps>((props: ListItemProps, ref) => {
    return (
        <div
            className={`border-bottom border-1 p-2 d-flex text-truncate ${
                props.selected ? 'bg-light text-dark' : ''
            } ${props.isDirectory ? 'fw-bold' : ''}`}
            onClick={props.onClick}
            onDoubleClick={props.onDoubleClick}
            ref={ref}
        >
            {props.children}
        </div>
    );
});

export default ListItem;
