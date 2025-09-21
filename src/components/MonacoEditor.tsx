import React from 'react';
import Editor from '@monaco-editor/react';
export function MonacoEditor({
  value,
  onChange,
  language,
  theme,
  onMount
}) {
  const handleEditorDidMount = (editor, monaco) => {
    // Call the original onMount if provided
    if (onMount) {
      onMount(editor, monaco);
    }
    
    
    // Add click event listener to detect clicks on message objects
    editor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.CONTENT_TEXT) {
        const position = e.target.position;
        if (position) {
          // Get the line content to check if we're clicking on a message
          const lineContent = editor.getModel().getLineContent(position.lineNumber);
          
          // Check if this line is part of a message object (look for "role" or "content" property)
          if (lineContent.includes('"role"') || lineContent.includes('"content"')) {
            // Find which message this is by counting message objects
            const model = editor.getModel();
            let messageIndex = -1;
            let inMessagesArray = false;
            let braceDepth = 0;
            
            for (let lineNum = 1; lineNum <= position.lineNumber; lineNum++) {
              const line = model.getLineContent(lineNum);
              
              // Check if we're entering the messages array
              if (line.includes('"messages"') && line.includes('[')) {
                inMessagesArray = true;
                continue;
              }
              
              // If we're in the messages array, count message objects
              if (inMessagesArray) {
                // Count opening braces
                const openBraces = (line.match(/{/g) || []).length;
                const closeBraces = (line.match(/}/g) || []).length;
                
                // If we hit a message object start (role property at depth 1, which means inside a message object)
                if (line.includes('"role"') && braceDepth === 1) {
                  messageIndex++;
                }
                
                braceDepth += openBraces - closeBraces;
              }
            }
            
            // If we found a valid message index, trigger the click handler
            if (messageIndex >= 0) {
              // Trigger a custom event that the parent can listen to
              const clickEvent = new CustomEvent('messageClick', { 
                detail: { messageIndex } 
              });
              editor.getDomNode().dispatchEvent(clickEvent);
            }
          }
        }
      }
    });
  };

  return <Editor height="100%" defaultLanguage={language || 'javascript'} defaultValue={value} value={value} onChange={onChange} theme={theme || 'vs-light'} options={{
    minimap: {
      enabled: false
    },
    scrollBeyondLastLine: false,
    fontSize: 14,
    wordWrap: 'on',
    automaticLayout: true
  }} onMount={handleEditorDidMount} />;
}
