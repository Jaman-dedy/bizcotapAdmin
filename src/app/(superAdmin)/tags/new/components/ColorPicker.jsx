// components/ColorPicker.js
import React, { useState } from 'react';
import { Typography, Tooltip, Popover, Tabs, Badge } from 'antd';
import { EditOutlined, BgColorsOutlined, AppstoreOutlined, StarOutlined } from '@ant-design/icons';
import { ColorPicker as AntColorPicker } from 'antd';

const { Text, Title } = Typography;

/**
 * Enhanced color picker component with solid colors, patterns, and custom color selector
 * 
 * @param {string} name - Name identifier for the color picker
 * @param {string} label - Display label for the color picker
 * @param {string} currentColor - Current selected color or pattern
 * @param {function} onChange - Function to call when selection changes (name, value)
 * @param {boolean} isPremium - Whether premium features are available
 */
const ColorPicker = ({ 
  name, 
  label, 
  currentColor, 
  onChange,
  isPremium = true 
}) => {
  // Define favorite solid colors
  const favoriteColors = [
    { id: 'white', color: '#ffffff', name: 'White' },
    { id: 'black', color: '#000000', name: 'Black' },
    { id: 'blue', color: '#1a4da2', name: 'Blue' },
    { id: 'red', color: '#E57373', name: 'Red' },
    { id: 'green', color: '#4CAF50', name: 'Green' }
  ];
  
  // Define gradient and pattern options
  const backgroundPatterns = [
    { 
      id: 'gradient1', 
      name: 'Blue Gradient', 
      value: 'linear-gradient(135deg, #1a4da2 0%, #2d7dd2 100%)',
      style: { background: 'linear-gradient(135deg, #1a4da2 0%, #2d7dd2 100%)' }
    },
    { 
      id: 'gradient2', 
      name: 'Warm Gradient', 
      value: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
      style: { background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)' }
    },
    { 
      id: 'gradient3', 
      name: 'Green Gradient', 
      value: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      style: { background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' }
    },
    { 
      id: 'pattern1', 
      name: 'Dots', 
      value: 'radial-gradient(#00000022 1px, transparent 0) 0 0 / 10px 10px',
      style: { 
        background: '#ffffff', 
        backgroundImage: 'radial-gradient(#00000022 1px, transparent 0)', 
        backgroundSize: '10px 10px' 
      }
    },
  ];
  
  // Helper to determine if a color is light
  const isLightColor = (hexColor) => {
    if (!hexColor || !hexColor.startsWith('#')) return true;
    
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate perceived brightness (YIQ formula)
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // YIQ < 128 means it's a dark color
    return yiq >= 128;
  };
  
  // Handler for solid color selection
  const handleColorClick = (color) => {
    onChange(name, color);
  };
  
  // Handler for pattern selection
  const handlePatternClick = (pattern) => {
    onChange(name, pattern.value);
  };
  
  // Check if current selection is a pattern
  const isPattern = currentColor && 
    (currentColor.includes('gradient') || currentColor.includes('radial-gradient'));
  
  // Determine the preview background style
  const getPreviewStyle = () => {
    if (isPattern) {
      const pattern = backgroundPatterns.find(p => p.value === currentColor);
      return pattern ? pattern.style : { background: currentColor };
    }
    return { backgroundColor: currentColor || '#ffffff' };
  };
  
  // Custom color picker content
  const customColorPickerContent = (
    <AntColorPicker
      showText
      format="hex"
      value={currentColor && currentColor.startsWith('#') ? currentColor : '#1677ff'}
      onChange={(color, hex) => onChange(name, hex)}
      presets={[
        {
          label: 'Recommended',
          colors: favoriteColors.map(option => option.color)
        }
      ]}
    />
  );
  
  // Render color circles for solid colors
  const renderColorCircles = () => {
    return (
      <div className="flex items-center space-x-3 mb-4">
        {favoriteColors.map(option => (
          <Tooltip key={option.id} title={option.name}>
            <div 
              className={`color-circle ${option.color === currentColor ? 'selected' : ''}`}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: option.color,
                border: option.color === currentColor ? '2px solid #1890ff' : '1px solid #d9d9d9',
                boxShadow: option.color === currentColor ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : 'none'
              }}
              onClick={() => handleColorClick(option.color)}
            >
              {/* Show selected checkmark */}
              {option.color === currentColor && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" 
                        fill={isLightColor(option.color) ? '#000' : '#fff'} />
                </svg>
              )}
            </div>
          </Tooltip>
        ))}
        
        {/* Custom color picker button */}
        <Popover
          trigger="click"
          content={customColorPickerContent}
          title="Choose custom color"
        >
          <Tooltip title="Custom color">
            <div 
              className="color-circle custom-color"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)',
                border: '1px solid #d9d9d9',
                overflow: 'hidden'
              }}
            >
              <EditOutlined style={{ color: '#fff', fontSize: '16px' }} />
            </div>
          </Tooltip>
        </Popover>
      </div>
    );
  };
  
  // Render pattern options
  const renderPatternOptions = () => {
    return (
      <div className="grid grid-cols-2 gap-3">
        {backgroundPatterns.map(pattern => (
          <Tooltip key={pattern.id} title={pattern.name}>
            <div 
              className={`pattern-option rounded-lg overflow-hidden ${pattern.value === currentColor ? 'selected' : ''}`}
              style={{
                height: '60px',
                cursor: 'pointer',
                border: pattern.value === currentColor ? '2px solid #1890ff' : '1px solid #d9d9d9',
                boxShadow: pattern.value === currentColor ? '0 0 0 2px rgba(24, 144, 255, 0.2)' : 'none',
                ...pattern.style
              }}
              onClick={() => handlePatternClick(pattern)}
            >
              {/* Show selected checkmark */}
              {pattern.value === currentColor && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="bg-white bg-opacity-50 rounded-full p-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 16.2L4.8 12L3.4 13.4L9 19L21 7L19.6 5.6L9 16.2Z" fill="#000" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </Tooltip>
        ))}
      </div>
    );
  };
  
  return (
    <div className="color-picker-container mb-6">
      <div className="flex items-center justify-between mb-2">
        <Title level={5} style={{ margin: 0 }}>{label}</Title>
        
        {/* Current color preview */}
        <div className="color-preview flex items-center">
          <div 
            className="mr-2 rounded-md border border-gray-200"
            style={{
              width: '24px',
              height: '24px',
              ...getPreviewStyle()
            }}
          ></div>
          <Text type="secondary">
            {isPattern ? 'Pattern' : currentColor || 'None'}
          </Text>
        </div>
      </div>
      
      {/* Color selection options */}
      <div className="color-options mt-3">
        {isPremium ? (
          <Tabs
            defaultActiveKey="colors"
            items={[
              {
                key: 'colors',
                label: (
                  <span>
                    <BgColorsOutlined />
                    Colors
                  </span>
                ),
                children: renderColorCircles(),
              },
              {
                key: 'patterns',
                label: (
                  <span>
                    <AppstoreOutlined />
                    Patterns
                  </span>
                ),
                children: renderPatternOptions(),
              }
            ]}
          />
        ) : (
          <>
            {renderColorCircles()}
          </>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;