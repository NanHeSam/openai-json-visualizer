import React, { useEffect, useState, useRef } from 'react';
import { MonacoEditor } from './MonacoEditor';
export function JsonEditor({
  jsonData,
  onJsonChange,
  isValid,
  darkMode,
  selectedMessageIndex,
  monacoEditorRef,
  onMessageClick
}) {
  const [jsonString, setJsonString] = useState('');
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);
  useEffect(() => {
    try {
      const formatted = JSON.stringify(jsonData, null, 2);
      setJsonString(formatted);
    } catch (error) {
      console.error('Error stringifying JSON:', error);
    }
  }, [jsonData]);
  useEffect(() => {
    if (selectedMessageIndex !== null && editorRef.current) {
      highlightMessageInEditor(selectedMessageIndex);
    }
  }, [selectedMessageIndex, jsonString]);
  const handleChange = value => {
    setJsonString(value);
    onJsonChange(value);
  };
  const handleEditorDidMount = editor => {
    editorRef.current = editor;
    monacoEditorRef.current = editor; // Store editor instance for scroll sync
    if (selectedMessageIndex !== null) {
      highlightMessageInEditor(selectedMessageIndex);
    }
    
    // Listen for custom message click events
    const handleMessageClick = (event) => {
      if (onMessageClick && event.detail && typeof event.detail.messageIndex === 'number') {
        onMessageClick(event.detail.messageIndex);
      }
    };
    
    editor.getDomNode().addEventListener('messageClick', handleMessageClick);
    
    // Cleanup function
    return () => {
      editor.getDomNode().removeEventListener('messageClick', handleMessageClick);
    };
  };
  // Improved debug version: Print logs and fix message object detection to avoid matching tool_calls or nested objects.
  // The previous logic counted any '{' at the top level of the messages array, but this can match nested objects (like tool_calls).
  // Instead, we should only count objects that are direct children of the messages array (i.e., not nested inside another object/array).
  const highlightMessageInEditor = index => {
    if (!editorRef.current) return;
    // Clear previous decorations
    if (decorationsRef.current.length) {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
    try {
      const text = jsonString;
      const lines = text.split('\n');

      // Find the start and end line of the "messages" array
      let messagesArrayStart = -1;
      let messagesArrayEnd = -1;
      let inMessagesArray = false;
      let arrayBracketDepth = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!inMessagesArray) {
          if (/"messages"\s*:\s*\[\s*$/.test(line) || /"messages"\s*:\s*\[/.test(line)) {
            inMessagesArray = true;
            messagesArrayStart = i;
            arrayBracketDepth = (line.match(/\[/g) || []).length - (line.match(/]/g) || []).length;
          }
        } else {
          // Track array bracket depth to find the end of the messages array
          arrayBracketDepth += (line.match(/\[/g) || []).length;
          arrayBracketDepth -= (line.match(/]/g) || []).length;
          if (arrayBracketDepth === 0) {
            messagesArrayEnd = i;
            break;
          }
        }
      }
      if (messagesArrayStart === -1 || messagesArrayEnd === -1) {
        return;
      }

      // Now, within the messages array, find the Nth message object at the top level
      let messageIdx = -1;
      let foundStart = -1;
      let foundEnd = -1;
      let inObject = false;
      let objectBracketDepth = 0;
      for (let i = messagesArrayStart + 1; i < messagesArrayEnd; i++) {
        const line = lines[i];
        // Only consider '{' that are not nested inside another object/array
        // We track the current "top-level" depth inside the messages array
        // When not inObject and line starts with '{' at depth 0, it's a new message
        if (!inObject) {
          // Calculate the indentation level (number of leading spaces)
          const trimmed = line.trimStart();
          const indent = line.length - trimmed.length;
          // Only consider lines that start with '{' and are not indented more than the array itself
          // (This is a heuristic: assumes pretty-printed JSON)
          if (trimmed.startsWith('{')) {
            // To be more robust, track bracket depth for objects
            inObject = true;
            objectBracketDepth = (trimmed.match(/{/g) || []).length - (trimmed.match(/}/g) || []).length;
            messageIdx++;
            if (messageIdx === index) {
              foundStart = i;
              if (objectBracketDepth === 0) {
                foundEnd = i;
                break;
              }
              continue;
            }
          }
        } else if (messageIdx === index) {
          // Track curly bracket depth to find the end of the object
          objectBracketDepth += (line.match(/{/g) || []).length;
          objectBracketDepth -= (line.match(/}/g) || []).length;
          if (objectBracketDepth === 0) {
            foundEnd = i;
            break;
          }
        } else {
          // If not the target message, still need to track when the current object ends
          objectBracketDepth += (line.match(/{/g) || []).length;
          objectBracketDepth -= (line.match(/}/g) || []).length;
          if (objectBracketDepth === 0) {
            inObject = false;
          }
        }
      }

      if (foundStart !== -1 && foundEnd !== -1) {
        const startColumn = 1;
        const endColumn = lines[foundEnd].length + 1;
        decorationsRef.current = editorRef.current.deltaDecorations([], [{
          range: {
            startLineNumber: foundStart + 1,
            startColumn: startColumn,
            endLineNumber: foundEnd + 1,
            endColumn: endColumn
          },
          options: {
            isWholeLine: true,
            className: darkMode ? 'bg-blue-900' : 'bg-blue-100',
            inlineClassName: darkMode ? 'bg-blue-800' : 'bg-blue-50'
          }
        }]);
        // Scroll to the highlighted message
        editorRef.current.revealLineInCenter(foundStart + 1);
      } else {
      }
    } catch (error) {
      console.error('Error highlighting message:', error);
    }
  };
  return <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">JSON Editor</h2>
        <div className={`px-2 py-1 rounded text-sm ${isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {isValid ? 'Valid JSON' : 'Invalid JSON'}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <MonacoEditor 
          value={jsonString} 
          onChange={handleChange} 
          language="json" 
          theme={darkMode ? 'vs-dark' : 'vs-light'} 
          onMount={handleEditorDidMount}
        />
      </div>
    </div>;
}
