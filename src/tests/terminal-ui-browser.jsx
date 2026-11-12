import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TerminalAnswer } from '../terminal-workspace.jsx';

const item = window.TERMINAL_ITEMS.find(entry => entry.id === new URLSearchParams(location.search).get('item'));
window.__submits = 0;
window.__answer = null;

function Harness() {
  const [value, setValue] = useState(undefined);
  const [mount, setMount] = useState(0);
  window.__remount = () => setMount(count => count + 1);
  return <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
    <TerminalAnswer key={mount} item={item} value={value} saving={false}
      onChange={(question, next) => { window.__answer = next; setValue(next); }}
      onSubmit={event => { event.preventDefault(); window.__submits++; }} />
    <button type="submit" form="answer-form" id="grade">採点する</button>
  </div>;
}

createRoot(document.getElementById('root')).render(<Harness />);
