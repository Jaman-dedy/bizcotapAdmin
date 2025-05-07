// components/LinkItem.js
import React from 'react';
import { Button, Card } from 'antd';
import { DeleteOutlined, DragOutlined } from '@ant-design/icons';
import Image from 'next/image';

const LinkItem = ({ 
  link, 
  onRemove, 
  onEdit, 
  dragHandleProps = {},
  isDragging = false
}) => {
  return (
    <Card 
      className={`border rounded-lg p-0 bg-white shadow-sm hover:shadow-md transition-shadow ${isDragging ? 'opacity-50' : ''}`}
      bodyStyle={{ padding: '12px 16px' }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center flex-grow">
          {/* Drag handle */}
          <div 
            className="mr-2 text-gray-400 cursor-move flex items-center justify-center"
            {...dragHandleProps}
          >
            <DragOutlined style={{ fontSize: '16px' }} />
          </div>
          
          {/* Link icon */}
          <div className="mr-3 flex items-center justify-center w-8 h-8">
            <div className="relative w-6 h-6">
              <Image 
                src={link.icon} 
                alt={link.title}
                width={24} 
                height={24}
                className="object-contain" 
              />
            </div>
          </div>
          
          {/* Link title */}
          <div className="flex-grow">
            <div className="font-medium">{link.title}</div>
            <div className="text-gray-500 text-sm truncate max-w-xs">
              {link.value || link.placeholder}
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          {/* Edit button */}
          <Button 
            type="link" 
            onClick={() => onEdit(link.id)}
            size="small"
            className="text-blue-500"
          >
            Edit
          </Button>
          
          {/* Delete button */}
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onRemove(link.id)}
            size="small"
          />
        </div>
      </div>
    </Card>
  );
};

export default LinkItem;