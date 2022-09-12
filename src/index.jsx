import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Pictures from './components/Pictures';
import { HotKeys } from 'react-hotkeys';
import { configure } from 'react-hotkeys';

configure({
    ignoreKeymapAndHandlerChangesByDefault: false,
    logLevel: 'debug',
    ignoreTags: ['select', 'textarea'],
    // bug workaround
    // https://github.com/greena13/react-hotkeys/issues/237#issuecomment-542071974
    customKeyCodes: {
        13: '_enter',
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

const keyMap = {
    MOVE_UP: 'up',
    ENTER: '_enter',
    MOVE_DOWN: 'down',
    SEARCH: 'Control+f'
};

root.render(
    <HotKeys keyMap={keyMap}>
        <HashRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="pictures/:path" element={<Pictures />} />
            </Routes>
        </HashRouter>
    </HotKeys>
);
