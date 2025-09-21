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
  const jsonScrollRef = useRef(null);
  const chatScrollRef = useRef(null);
  const isScrollingSynced = useRef(false);
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
  const handleSyncScroll = (sourceRef, targetRef, event) => {
    if (isScrollingSynced.current) return;
    if (!sourceRef.current || !targetRef.current) return;
    const sourceElement = sourceRef.current;
    const targetElement = targetRef.current;
    const sourceScrollHeight = sourceElement.scrollHeight - sourceElement.clientHeight;
    const targetScrollHeight = targetElement.scrollHeight - targetElement.clientHeight;
    if (sourceScrollHeight <= 0 || targetScrollHeight <= 0) return;
    const scrollPercentage = sourceElement.scrollTop / sourceScrollHeight;
    isScrollingSynced.current = true;
    targetElement.scrollTop = scrollPercentage * targetScrollHeight;
    // Reset the flag after a short delay to prevent infinite loops
    setTimeout(() => {
      isScrollingSynced.current = false;
    }, 50);
  };
  return <div className={`flex flex-col h-screen w-full ${config.darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">OpenAI JSON Visualizer</h1>
        <button onClick={() => setConfigOpen(!configOpen)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          {configOpen ? 'Hide Config' : 'Show Config'}
        </button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 ${configOpen ? 'w-1/3' : 'w-1/2'} overflow-auto border-r`} ref={jsonScrollRef} onScroll={e => handleSyncScroll(jsonScrollRef, chatScrollRef, e)}>
          <JsonEditor jsonData={jsonData} onJsonChange={handleJsonChange} isValid={isValidJson} darkMode={config.darkMode} selectedMessageIndex={selectedMessageIndex} />
        </div>
        <div className={`flex-1 ${configOpen ? 'w-1/3' : 'w-1/2'} overflow-auto`} ref={chatScrollRef} onScroll={e => handleSyncScroll(chatScrollRef, jsonScrollRef, e)}>
          <ChatVisualization data={jsonData} config={config} onMessageUpdate={handleMessageUpdate} onMessageSelect={handleMessageSelect} />
        </div>
        {configOpen && <div className="w-1/3 border-l overflow-auto">
            <ConfigPanel config={config} onConfigChange={handleConfigChange} darkMode={config.darkMode} />
          </div>}
      </div>
    </div>;
}
