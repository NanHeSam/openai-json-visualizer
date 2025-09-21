import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, WrenchIcon, ArrowRightIcon } from 'lucide-react';
export function MessageBubble({
  message,
  index,
  config,
  onContentChange,
  onClick
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [expandedToolCalls, setExpandedToolCalls] = useState({});
  const [expandedToolResult, setExpandedToolResult] = useState(false);
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';
  const isSystem = message.role === 'system';
  const isTool = message.role === 'tool';
  const hasToolCalls = message.tool_calls && Array.isArray(message.tool_calls) && message.tool_calls.length > 0;
  const toggleToolCallExpansion = (id, e) => {
    e.stopPropagation();
    setExpandedToolCalls(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const toggleToolResultExpansion = e => {
    e.stopPropagation();
    setExpandedToolResult(!expandedToolResult);
  };
  const getBubbleStyles = () => {
    if (isUser) {
      return config.darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white';
    } else if (isAssistant) {
      return config.darkMode ? 'bg-gray-700 text-white' : 'bg-white border border-gray-300 text-gray-800';
    } else if (isSystem) {
      return config.darkMode ? 'bg-gray-600 text-gray-200 italic' : 'bg-gray-100 text-gray-600 italic';
    } else if (isTool) {
      return config.darkMode ? 'bg-gray-700 text-white' : 'bg-white border border-gray-300 text-gray-800';
    }
    return config.darkMode ? 'bg-gray-700 text-white' : 'bg-white border border-gray-300 text-gray-800';
  };
  const handleSaveEdit = () => {
    onContentChange(editContent);
    setIsEditing(false);
  };
  const handleContentClick = e => {
    e.stopPropagation();
    setIsEditing(true);
  };
  const renderToolCall = (toolCall, idx) => {
    if (toolCall.type !== 'function' || !toolCall.function) return null;
    const {
      id,
      function: func
    } = toolCall;
    const isExpanded = expandedToolCalls[id] || false;
    // Try to parse the arguments JSON
    let formattedArguments = '';
    try {
      const args = JSON.parse(func.arguments);
      formattedArguments = JSON.stringify(args, null, 2);
    } catch (e) {
      formattedArguments = func.arguments;
    }
    return <div key={id || idx} className={`mt-2 rounded-md ${config.darkMode ? 'bg-gray-800' : 'bg-gray-100'} overflow-hidden`}>
        <div className={`flex items-center justify-between px-3 py-2 cursor-pointer ${config.darkMode ? 'bg-blue-800' : 'bg-blue-100'}`} onClick={e => toggleToolCallExpansion(id, e)}>
          <div className="flex items-center space-x-2">
            <WrenchIcon className="h-4 w-4" />
            <span className="font-medium">{func.name}</span>
          </div>
          {isExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
        </div>
        {isExpanded && <div className={`p-3 text-sm ${config.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <pre className="whitespace-pre-wrap font-mono text-xs overflow-x-auto">
              {formattedArguments}
            </pre>
          </div>}
      </div>;
  };
  const renderToolResult = () => {
    if (!isTool || !message.content) return null;
    return <div className={`rounded-md ${config.darkMode ? 'bg-gray-800' : 'bg-gray-100'} overflow-hidden`}>
        <div className={`flex items-center justify-between px-3 py-2 cursor-pointer ${config.darkMode ? 'bg-green-800' : 'bg-green-100'}`} onClick={e => toggleToolResultExpansion(e)}>
          <div className="flex items-center space-x-2">
            <ArrowRightIcon className="h-4 w-4" />
            <span className="font-medium">
              {message.name || (message.tool_call_id ? `Result: ${message.tool_call_id}` : 'Tool Result')}
            </span>
          </div>
          {expandedToolResult ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
        </div>
        {expandedToolResult && <div className={`p-3 text-sm ${config.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <pre className="whitespace-pre-wrap font-mono text-xs overflow-x-auto">
              {message.content}
            </pre>
          </div>}
      </div>;
  };
  return <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`} onClick={() => onClick(index)}>
      <div className={`max-w-[80%] rounded-lg p-4 ${getBubbleStyles()} cursor-pointer hover:opacity-90 transition-opacity`}>
        {config.showRoleLabels && !isTool && <div className="text-xs mb-1 font-semibold uppercase">
            {message.role}
          </div>}
        {isEditing ? <div className="flex flex-col" onClick={e => e.stopPropagation()}>
            <textarea value={editContent} onChange={e => setEditContent(e.target.value)} className="w-full p-2 mb-2 rounded text-black" rows={4} />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsEditing(false)} className="px-2 py-1 text-sm rounded bg-gray-300 text-gray-700 hover:bg-gray-400">
                Cancel
              </button>
              <button onClick={handleSaveEdit} className="px-2 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600">
                Save
              </button>
            </div>
          </div> : <>
            {isTool ? renderToolResult() : <>
                {message.content && <div onClick={handleContentClick} className="cursor-pointer">
                    {message.content}
                  </div>}
                {hasToolCalls && <div className="mt-2">
                    {message.tool_calls.map((toolCall, idx) => renderToolCall(toolCall, idx))}
                  </div>}
              </>}
          </>}
        {config.showTimestamps && <div className="text-xs mt-2 opacity-70">
            {new Date().toLocaleTimeString()}
          </div>}
      </div>
    </div>;
}