import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CodeWorkspace } from '../answer-workspace.jsx';

const item = {
  id: 'editor-input-sample',
  type: 'code',
  language: 'js',
  grading: { kind: 'code', starter: '' },
};

function App() {
  const [value, setValue] = useState('');
  return (
    <>
      <div id="workspace" style={{ height: '400px', width: '800px' }}>
        <CodeWorkspace item={item} value={value} answers={{}} theme="light" saving={false} onChange={next => setValue(next)} />
      </div>
      <pre id="value">{typeof value === 'string' ? value : JSON.stringify(value)}</pre>
      <button id="clear" type="button" onClick={() => setValue('')}>clear</button>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
