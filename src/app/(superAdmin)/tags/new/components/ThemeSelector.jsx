// components/ThemeSelector.js
import React, { useState, useEffect } from 'react';
import { Card, Divider } from 'antd';
import ColorPicker from './ColorPicker';
import ColorPicker from './ColorPicker';

/**
 * Theme selector component with card theme and link color pickers
 * 
 * @param {Object} initialTheme - Initial theme values
 * @param {Function} onThemeChange - Function to call when theme changes
 */
const ThemeSelector = ({ 
  initialTheme = {
    cardTheme: '#ffffff',
    linkColor: '#f5f5f5',
    linkIconColor: '#1890ff'
  }, 
  onThemeChange 
}) => {
  // State for theme options
  const [cardTheme, setCardTheme] = useState(initialTheme.cardTheme);
  const [linkColor, setLinkColor] = useState(initialTheme.linkColor);
  
  // When colors change, notify parent component
  useEffect(() => {
    if (typeof onThemeChange === 'function') {
      onThemeChange({
        cardTheme,
        linkColor,
        // Optionally update link icon color based on the link color
        linkIconColor: initialTheme.linkIconColor
      });
    }
  }, [cardTheme, linkColor, initialTheme.linkIconColor, onThemeChange]);
  
  return (
    <div className="theme-selector-container">
      <h2 className="text-2xl font-normal text-gray-700 mb-6">Choose Theme</h2>
      
      <Card 
        className="bg-white rounded-xl shadow-sm"
        bodyStyle={{ padding: '24px' }}
        bordered={false}
      >
        {/* Card Theme Picker */}
        <ColorPicker
          label="Card Theme"
          currentColor={cardTheme}
          onChange={setCardTheme}
        />
        
        <Divider className="my-6" />
        
        {/* Link Color Picker */}
        <ColorPicker
          label="Link Color"
          currentColor={linkColor}
          onChange={setLinkColor}
          showPhoneIcons={true}
        />
      </Card>
    </div>
  );
};

export default ThemeSelector;