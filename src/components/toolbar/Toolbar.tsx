export default function Toolbar(props: { children?: React.ReactNode }) {
    return <div className="p-2 pt-0 border-bottom border-1 d-flex align-items-center">{props.children}</div>;
}
