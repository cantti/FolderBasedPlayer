import Scrollbars from 'react-custom-scrollbars-2';

type CustomScrollbarsProps = {
    children?: React.ReactNode;
};

export default function CustomScrollbars(props: CustomScrollbarsProps) {
    return (
        <Scrollbars renderThumbVertical={(props) => <div {...props} className="thumb-vertical" />}>
            {props.children}
        </Scrollbars>
    );
}
