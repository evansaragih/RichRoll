import React from 'react';
import ReactDOM from 'react-dom/client';
import { Agentation } from 'agentation';

if (import.meta.env.DEV) {
  const rootId = 'agentation-root';
  let rootEl = document.getElementById(rootId);
  if (!rootEl) {
    rootEl = document.createElement('div');
    rootEl.id = rootId;
    document.body.appendChild(rootEl);
  }
  const root = ReactDOM.createRoot(rootEl);
  root.render(<Agentation />);
}
