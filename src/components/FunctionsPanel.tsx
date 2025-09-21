import React, { useState, Children } from 'react';
import { ChevronDownIcon, ChevronRightIcon, TypeIcon, HashIcon, CheckSquareIcon, ListIcon, BoxIcon, CalendarIcon, FileIcon, GlobeIcon } from 'lucide-react';
// Helper component to display parameter properties
const ParameterProperty = ({
  name,
  schema,
  required,
  darkMode,
  indent = 0
}) => {
  const [expanded, setExpanded] = useState(false);
  const isRequired = required && required.includes(name);
  // Determine the icon based on type
  const getTypeIcon = (type, format) => {
    if (type === 'string') {
      if (format === 'date' || format === 'date-time') return <CalendarIcon className="h-3.5 w-3.5" />;
      if (format === 'uri' || format === 'url') return <GlobeIcon className="h-3.5 w-3.5" />;
      return <TypeIcon className="h-3.5 w-3.5" />;
    }
    if (type === 'number' || type === 'integer') return <HashIcon className="h-3.5 w-3.5" />;
    if (type === 'boolean') return <CheckSquareIcon className="h-3.5 w-3.5" />;
    if (type === 'array') return <ListIcon className="h-3.5 w-3.5" />;
    if (type === 'object') return <BoxIcon className="h-3.5 w-3.5" />;
    return <FileIcon className="h-3.5 w-3.5" />;
  };
  // For enum values
  const renderEnum = enumValues => {
    if (!enumValues || !Array.isArray(enumValues)) return null;
    return <div className={`mt-1 ml-6 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Options: {enumValues.map(val => `"${val}"`).join(', ')}
      </div>;
  };
  // For objects with properties
  const renderProperties = (properties, required = []) => {
    if (!properties) return null;
    return <div className="ml-4 mt-2 border-l-2 pl-2 space-y-2 border-gray-600">
        {Object.entries(properties).map(([propName, propSchema]) => <ParameterProperty key={propName} name={propName} schema={propSchema} required={required} darkMode={darkMode} indent={indent + 1} />)}
      </div>;
  };
  // For array items
  const renderItems = items => {
    if (!items) return null;
    return <div className="ml-4 mt-2 border-l-2 pl-2 border-gray-600">
        <div className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Array items:
        </div>
        <div className="mt-1">
          <ParameterProperty name="(item)" schema={items} required={[]} darkMode={darkMode} indent={indent + 1} />
        </div>
      </div>;
  };
  const isObject = schema.type === 'object' && schema.properties;
  const isArray = schema.type === 'array' && schema.items;
  const hasChildren = isObject || isArray;
  return <div className={`${indent > 0 ? 'mt-2' : ''}`}>
      <div className="flex items-start">
        <div className="flex items-center">
          {hasChildren && <button onClick={() => setExpanded(!expanded)} className="mr-1 focus:outline-none">
              {expanded ? <ChevronDownIcon className="h-3.5 w-3.5" /> : <ChevronRightIcon className="h-3.5 w-3.5" />}
            </button>}
          {!hasChildren && <span className="w-3.5 mr-1"></span>}
          <span className="mr-1.5">
            {getTypeIcon(schema.type, schema.format)}
          </span>
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            {name}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </span>
          <span className={`ml-2 text-xs px-1.5 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
            {schema.type}
            {schema.format && `-${schema.format}`}
          </span>
        </div>
      </div>
      {schema.description && <div className={`mt-0.5 ml-6 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {schema.description}
        </div>}
      {schema.enum && renderEnum(schema.enum)}
      {expanded && isObject && renderProperties(schema.properties, schema.required)}
      {expanded && isArray && renderItems(schema.items)}
    </div>;
};
export function FunctionsPanel({
  functions,
  tools,
  darkMode
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Process either functions or tools to get a standardized list of functions
  const getFunctions = () => {
    // If tools array exists, extract functions from it
    if (tools && Array.isArray(tools) && tools.length > 0) {
      return tools.filter(tool => tool.type === 'function' && tool.function).map(tool => ({
        ...tool.function,
        function_call: tool.function_call
      }));
    }
    // Otherwise use the functions array if it exists
    return Array.isArray(functions) ? functions : [];
  };
  const allFunctions = getFunctions();
  if (allFunctions.length === 0) {
    return null;
  }
  return <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className={`flex items-center justify-between p-3 cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center">
          {isExpanded ? <ChevronDownIcon className="h-4 w-4 mr-2" /> : <ChevronRightIcon className="h-4 w-4 mr-2" />}
          <h3 className="font-medium">Functions ({allFunctions.length})</h3>
        </div>
        <div className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-800'}`}>
          API Feature
        </div>
      </div>
      {isExpanded && <div className="p-4 space-y-4">
          {allFunctions.map((func, index) => <div key={index} className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-sm">{func.name}</h4>
                {func.function_call === 'auto' && <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800'}`}>
                    Auto
                  </span>}
                {func.function_call === 'none' && <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'}`}>
                    None
                  </span>}
              </div>
              {func.description && <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {func.description}
                </p>}
              {func.parameters && <div className="mt-3">
                  <h5 className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    PARAMETERS
                  </h5>
                  <div className={`p-3 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    {func.parameters.type === 'object' && func.parameters.properties && <div className="space-y-2">
                          {Object.entries(func.parameters.properties).map(([propName, schema]) => <ParameterProperty key={propName} name={propName} schema={schema} required={func.parameters.required} darkMode={darkMode} />)}
                        </div>}
                  </div>
                </div>}
            </div>)}
        </div>}
    </div>;
}