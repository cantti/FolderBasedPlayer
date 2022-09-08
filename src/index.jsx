import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Pictures from './components/Pictures';

ReactDOM.render(
    <HashRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="pictures/:path" element={<Pictures />} />
        </Routes>
    </HashRouter>,
    document.getElementById('root')
);
