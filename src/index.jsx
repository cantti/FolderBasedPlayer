import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Pictures from './components/Pictures';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <HashRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="pictures/:path" element={<Pictures />} />
        </Routes>
    </HashRouter>
);
