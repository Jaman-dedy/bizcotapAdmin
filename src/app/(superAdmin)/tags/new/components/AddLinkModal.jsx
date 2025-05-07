// components/AddLinkModal.js
import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Input, Button, Tabs } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { linkCategories } from '../data/tagWizardData';

const AddLinkModal = ({ visible, onCancel, onAddLink, activeLinks }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('recommended');
  
  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
      setCurrentTab('recommended');
    }
  }, [visible]);
  
  // Filter links based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return linkCategories;
    }
    
    const query = searchQuery.toLowerCase();
    
    return linkCategories.map(category => ({
      ...category,
      links: category.links.filter(link => 
        link.name.toLowerCase().includes(query) || 
        link.type.toLowerCase().includes(query)
      )
    })).filter(category => category.links.length > 0);
  }, [searchQuery]);

  // Render a single link item
  const renderLinkItem = (link) => {
    const isActive = activeLinks.includes(link.type);
    
    return (
      <div 
        key={link.type} 
        className={`
          rounded-lg bg-gray-50 p-3 flex items-center justify-between cursor-pointer
          hover:shadow-sm border border-gray-200 transition-all
          ${isActive ? 'opacity-60 cursor-not-allowed' : 'hover:border-blue-500'}
        `}
        onClick={() => !isActive && onAddLink(link.type)}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 flex items-center justify-center">
            <Image 
              src={link.icon}
              alt={link.name}
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <span className="ml-3">{link.name}</span>
        </div>
        <Button 
          type="text" 
          shape="circle"
          icon={<PlusOutlined />} 
          disabled={isActive}
        />
      </div>
    );
  };

  return (
    <Modal
      title={
        <div className="flex flex-col">
          <div className="text-xl font-semibold">Add Section</div>
          <div className="text-sm text-gray-500">Add contact info, socials, websites and more.</div>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      className="add-link-modal"
    >
      <div className="py-4">
        {/* Search input */}
        <Input
          placeholder="Search Sections"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-6 h-12 text-lg"
          allowClear
        />
        
        {/* Tab navigation when not searching */}
        {!searchQuery && (
          <Tabs
            activeKey={currentTab}
            onChange={setCurrentTab}
            items={linkCategories.map(category => ({
              key: category.key,
              label: category.name,
              children: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {category.links.map(link => renderLinkItem(link))}
                </div>
              )
            }))}
          />
        )}
        
        {/* Search results */}
        {searchQuery && (
          <div>
            {filteredCategories.map((category) => (
              category.links.length > 0 && (
                <div key={category.key} className="mb-8">
                  <div className="text-lg font-medium mb-4">{category.name}</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {category.links.map(link => renderLinkItem(link))}
                  </div>
                </div>
              )
            ))}
            
            {/* No results message */}
            {filteredCategories.every(category => category.links.length === 0) && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <SearchOutlined style={{ fontSize: '24px' }} />
                </div>
                <div className="text-gray-500">No sections found matching "{searchQuery}"</div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddLinkModal;