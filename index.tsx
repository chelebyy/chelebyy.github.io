
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Self-hosted variable fonts (latin, latin-ext for Turkish, vietnamese subsets; the browser
// downloads only the subsets a page uses). Replaces the render-blocking Google Fonts request.
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/jetbrains-mono';
import './src/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
