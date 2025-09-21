import React from 'react';
import Editor from '@monaco-editor/react';
export function MonacoEditor({
  value,
  onChange,
  language,
  theme,
  onMount
}) {
  return <Editor height="100%" defaultLanguage={language || 'javascript'} defaultValue={value} value={value} onChange={onChange} theme={theme || 'vs-light'} options={{
    minimap: {
      enabled: false
    },
    scrollBeyondLastLine: false,
    fontSize: 14,
    wordWrap: 'on',
    automaticLayout: true
  }} onMount={onMount} />;
}