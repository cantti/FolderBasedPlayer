import { Button } from 'react-bootstrap';

type ToolbarButtonProps = {
    active?: boolean;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children?: React.ReactNode;
    title?: string;
};

export default function ToolbarButton(props: ToolbarButtonProps) {
    return (
        <Button
            size="sm"
            className="me-2 text-nowrap"
            variant={props.active ?? true ? 'outline-light' : 'outline-secondary'}
            onClick={props.onClick}
            onMouseDown={(e) => e.preventDefault()}
            title={props.title}
        >
            {props.children}
        </Button>
    );
}
