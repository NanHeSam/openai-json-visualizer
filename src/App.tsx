import React, { useEffect, useState, useRef } from 'react';
import { JsonEditor } from './components/JsonEditor';
import { ChatVisualization } from './components/ChatVisualization';
import { ConfigPanel } from './components/ConfigPanel';
import { defaultJson } from './utils/defaultData';
export function App() {
  const [jsonData, setJsonData] = useState(defaultJson);
  const [isValidJson, setIsValidJson] = useState(true);
  const [configOpen, setConfigOpen] = useState(false);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
  const [config, setConfig] = useState({
    darkMode: false,
    showTimestamps: false,
    messageSpacing: 'normal',
    showRoleLabels: true
  });
  const monacoEditorRef = useRef(null);

  const handleJsonChange = newJson => {
    try {
      const parsed = JSON.parse(newJson);
      setJsonData(parsed);
      setIsValidJson(true);
    } catch (error) {
      setIsValidJson(false);
    }
  };
  const handleConfigChange = newConfig => {
    setConfig(newConfig);
  };
  const handleMessageUpdate = updatedMessages => {
    setJsonData({
      ...jsonData,
      messages: updatedMessages
    });
  };
  const handleMessageSelect = index => {
    setSelectedMessageIndex(index);
  };

  const handleMessageClick = index => {
    setSelectedMessageIndex(index);
    
    // Scroll the chat visualization to the clicked message
    const chatContainer = document.querySelector('[data-chat-container]');
    if (chatContainer && jsonData.messages && jsonData.messages[index]) {
      // Find the message element in the chat
      const messageElements = chatContainer.querySelectorAll('[data-message-index]');
      const targetMessage = Array.from(messageElements).find(el => 
        parseInt(el.getAttribute('data-message-index')) === index
      );
      
      if (targetMessage) {
        // Scroll the message into view
        targetMessage.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  };
  return (
    <div className={`flex flex-col h-screen w-full ${config.darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">Chat Visualizer for AI Engineers</h1>
        <button onClick={() => setConfigOpen(!configOpen)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          {configOpen ? 'Hide Config' : 'Show Config'}
        </button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 ${configOpen ? 'w-1/3' : 'w-1/2'} border-r`}>
          <JsonEditor 
            jsonData={jsonData} 
            onJsonChange={handleJsonChange} 
            isValid={isValidJson} 
            darkMode={config.darkMode} 
            selectedMessageIndex={selectedMessageIndex}
            monacoEditorRef={monacoEditorRef}
            onMessageClick={handleMessageClick}
          />
        </div>
        <div className={`flex-1 ${configOpen ? 'w-1/3' : 'w-1/2'}`} data-chat-container>
          <ChatVisualization 
            data={jsonData} 
            config={config} 
            onMessageUpdate={handleMessageUpdate} 
            onMessageSelect={handleMessageSelect}
            selectedMessageIndex={selectedMessageIndex}
          />
        </div>
        {configOpen && <div className="w-1/3 border-l overflow-auto">
            <ConfigPanel config={config} onConfigChange={handleConfigChange} darkMode={config.darkMode} />
          </div>}
      </div>
    </div>
  );
}
