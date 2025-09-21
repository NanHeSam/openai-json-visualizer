import React from 'react';
import { MessageBubble } from './MessageBubble';
import { FunctionsPanel } from './FunctionsPanel';
export function ChatVisualization({
  data,
  config,
  onMessageUpdate,
  onMessageSelect,
  selectedMessageIndex
}) {
  if (!data || !data.messages || !Array.isArray(data.messages)) {
    return <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">No valid messages to display</p>
      </div>;
  }
  const handleMessageContentChange = (index, newContent) => {
    const updatedMessages = [...data.messages];
    updatedMessages[index].content = newContent;
    onMessageUpdate(updatedMessages);
  };
  const handleMessageClick = index => {
    onMessageSelect(index);
  };
  return <div className={`h-full flex flex-col ${config.darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="p-4 border-b">
        <h2 className="font-semibold">Chat Visualization</h2>
        {data.model && <p className="text-sm text-gray-500 mt-1">Model: {data.model}</p>}
      </div>
      <FunctionsPanel functions={data.functions} tools={data.tools} darkMode={config.darkMode} />
      <div className={`flex-1 overflow-y-auto p-4 ${getSpacingClass(config.messageSpacing)}`}>
        {data.messages.map((message, index) => <MessageBubble key={index} message={message} index={index} config={config} onContentChange={newContent => handleMessageContentChange(index, newContent)} onClick={() => handleMessageClick(index)} selected={selectedMessageIndex === index} />)}
      </div>
    </div>;
}
function getSpacingClass(spacing) {
  switch (spacing) {
    case 'compact':
      return 'space-y-2';
    case 'wide':
      return 'space-y-6';
    case 'normal':
    default:
      return 'space-y-4';
  }
}
