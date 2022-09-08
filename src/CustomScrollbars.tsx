import Scrollbars from 'react-custom-scrollbars-2';

type CustomScrollbars = {
    children?: React.ReactNode;
};

export default function CustomScrollbars(props: CustomScrollbars) {
    return (
        <Scrollbars
            renderThumbVertical={(props) => <div {...props} className="thumb-vertical" />}
            thumbSize={50}
        >
            {props.children}
        </Scrollbars>
    );
}
