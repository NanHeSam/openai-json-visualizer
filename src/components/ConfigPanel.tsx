import React from 'react';
export function ConfigPanel({
  config,
  onConfigChange,
  darkMode
}) {
  const handleChange = (key, value) => {
    onConfigChange({
      ...config,
      [key]: value
    });
  };
  return <div className={`h-full p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h2 className="font-semibold mb-4">Configuration</h2>
      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">Appearance</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={config.darkMode} onChange={e => handleChange('darkMode', e.target.checked)} className="h-4 w-4" />
              <span>Dark Mode</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={config.showRoleLabels} onChange={e => handleChange('showRoleLabels', e.target.checked)} className="h-4 w-4" />
              <span>Show Role Labels</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={config.showTimestamps} onChange={e => handleChange('showTimestamps', e.target.checked)} className="h-4 w-4" />
              <span>Show Timestamps</span>
            </label>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2">Layout</h3>
          <div className="space-y-2">
            <p className="text-sm">Message Spacing</p>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input type="radio" name="spacing" checked={config.messageSpacing === 'compact'} onChange={() => handleChange('messageSpacing', 'compact')} className="h-4 w-4" />
                <span>Compact</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input type="radio" name="spacing" checked={config.messageSpacing === 'normal'} onChange={() => handleChange('messageSpacing', 'normal')} className="h-4 w-4" />
                <span>Normal</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input type="radio" name="spacing" checked={config.messageSpacing === 'wide'} onChange={() => handleChange('messageSpacing', 'wide')} className="h-4 w-4" />
                <span>Wide</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>;
}