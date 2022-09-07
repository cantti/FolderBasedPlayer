import { forwardRef } from 'react';

type ListItemProps = {
    selected?: boolean;
    onClick?: () => void;
    onDoubleClick?: () => void;
    children?: React.ReactNode;
    isDirectory?: boolean;
};

const ListItem = forwardRef<HTMLDivElement, ListItemProps>((props: ListItemProps, ref) => {
    return (
        <div
            className={`border-bottom border-1 p-2 d-flex ${
                props.selected ? 'bg-primary text-light' : ''
            } ${props.isDirectory ? 'font-weight-bold' : ''}`}
            onClick={props.onClick}
            onDoubleClick={props.onDoubleClick}
            ref={ref}
        >
            {props.children}
        </div>
    );
});

export default ListItem;
