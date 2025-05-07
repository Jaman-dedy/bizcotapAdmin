// components/DigitalCardPreview.js
import React, { useState } from 'react';
import Image from 'next/image';
import { Button, Avatar, Switch } from 'antd';
import { RightOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';

const maskFadeStyle = {
  height: '250px',
  backgroundColor: 'transparent',
  WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 100%)',
  maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0) 100%)'
};

const DigitalCardPreview = ({ 
  design, 
  basicInfo, 
  links, 
  leadCapture, 
  avatarPreview, 
  backgroundPreview, 
  logoPreview 
}) => {
  // State to track which phone frame to display
  const [isIphone, setIsIphone] = useState(true);

  // Get formatted name
  const getFormattedName = () => {
    const firstName = basicInfo.firstName || 'First';
    const lastName = basicInfo.lastName || 'Last';
    return `${firstName} ${lastName}`;
  };

  // Get title for displaying position
  const getFormattedTitle = () => {
    const position = basicInfo.position;
    const company = basicInfo.company;
    
    if (position && company) {
      return `${position} at ${company}`;
    } else if (position) {
      return position;
    } else if (company) {
      return company;
    }
    
    return 'Title & Company';
  };

  // Render action buttons based on leadCapture.enabled
  const renderActionButtons = () => {
    // Show both buttons if lead capture is enabled
    if (leadCapture.enabled) {
      return (
        <div className="flex space-x-2">
          <Button 
            className="flex-1 h-12 rounded-full bg-blue-50 border-blue-100 text-blue-800 flex items-center justify-center"
            icon={<SwapOutlined />}
            style={{ padding: '0 16px' }}
          >
          </Button>
          <Button 
            type="primary"
            className="flex-1 h-12 rounded-full flex items-center justify-center"
            icon={<UserOutlined />}
            style={{ 
              backgroundColor: '#1a4da2', 
              borderColor: '#1a4da2',
              padding: '0 16px'
            }}
          >
            Save contact
          </Button>
        </div>
      );
    }
    
    // Show only save button if lead capture is disabled
    return (
      <Button 
        type="primary"
        className="h-12 rounded-full w-full flex items-center justify-center"
        icon={<UserOutlined />}
        style={{ 
          backgroundColor: '#1a4da2', 
          borderColor: '#1a4da2',
          padding: '0 16px'
        }}
      >
        Save Contact
      </Button>
    );
  };

  // Render a single link item with modern style
  const renderLinkItem = (link, index) => {
    // Check if this is a phone link to show WhatsApp button
    const isPhone = link.type === 'PHONE';
    
    return (
      <div 
        key={link.id || index}
        className="link-item flex items-center py-3 border-b border-gray-100"
      >
        {/* Left Icon */}
        <div className="link-icon mr-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center">
            {typeof link.icon === 'string' && link.icon.startsWith('/') ? (
              <Image 
                src={link.icon} 
                alt={link.title || "Link"}
                width={35}
                height={35}
                className="object-cover h-[35px] w-[35px]"
              />
            ) : (
              // Fallback for when icon is not a path but a React element
              <div className="text-sm text-white">
                {link.icon}
              </div>
            )}
          </div>
        </div>
        
        {/* Link Content */}
        <div className="link-content flex-grow">
          <div className="link-title font-small">
            {link.title || 'Link Title'}
          </div>
          <div className="link-value text-gray-400 text-sm truncate">
            {link.value || link.placeholder}
          </div>
        </div>
        
        {/* Right Action */}
        <div className="link-action ml-2">
          {isPhone ? (
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.6 6.31999C16.8 5.49999 15.8 4.89999 14.7 4.49999C13.6 4.09999 12.5 3.99999 11.3 4.09999C10.1 4.19999 9.00001 4.49999 7.90001 5.09999C6.80001 5.59999 5.90001 6.39999 5.10001 7.29999C4.30001 8.19999 3.80001 9.29999 3.40001 10.4C3.00001 11.5 2.90001 12.7 3.00001 13.9C3.10001 15.1 3.40001 16.2 4.00001 17.3C4.60001 18.4 5.40001 19.3 6.30001 20.1L6.40001 20.2C6.40001 20.2 6.50001 20.3 6.60001 20.4L7.00001 20.7C7.10001 20.7 7.10001 20.8 7.20001 20.8L7.30001 20.9C7.40001 21 7.60001 21.1 7.70001 21.1L8.00001 21.3C8.10001 21.4 8.30001 21.4 8.40001 21.5C8.50001 21.5 8.60001 21.6 8.70001 21.6C8.80001 21.6 8.80001 21.6 8.90001 21.6L9.10001 21.7L9.20001 21.7C9.40001 21.8 9.60001 21.8 9.80001 21.8C11.2 22.1 12.7 22 14.1 21.5C15.5 21 16.7 20.3 17.8 19.2C18.9 18.2 19.8 16.9 20.3 15.5C20.8 14.1 21 12.7 20.9 11.2C20.8 9.79999 20.3 8.39999 19.5 7.19999C19 6.89999 18.4 6.59999 17.6 6.31999ZM16.9 16.5C16.7 16.9 16.4 17.4 16 17.7C15.6 18 15.2 18.2 14.7 18.3C14.1 18.4 13.5 18.3 12.8 18.1C12.2 17.9 11.6 17.6 10.9 17.3C10.3 17 9.70001 16.6 9.10001 16.1C8.50001 15.6 8.00001 15.1 7.50001 14.6C7.00001 14 6.60001 13.5 6.20001 12.9C5.80001 12.3 5.50001 11.7 5.30001 11.1C5.10001 10.5 5.00001 9.89999 5.10001 9.29999C5.20001 8.79999 5.40001 8.29999 5.70001 7.79999C5.90001 7.49999 6.10001 7.19999 6.40001 6.99999C6.70001 6.79999 7.00001 6.79999 7.30001 6.79999C7.40001 6.79999 7.50001 6.79999 7.60001 6.79999C7.70001 6.79999 7.80001 6.79999 7.90001 6.89999C8.00001 6.99999 8.10001 7.09999 8.20001 7.29999C8.30001 7.49999 8.40001 7.69999 8.60001 7.89999L9.00001 8.69999C9.10001 8.79999 9.10001 8.89999 9.10001 8.99999C9.10001 9.09999 9.10001 9.19999 9.00001 9.29999C8.90001 9.39999 8.90001 9.49999 8.80001 9.59999C8.70001 9.69999 8.60001 9.79999 8.50001 9.89999C8.40001 9.99999 8.40001 10.1 8.30001 10.2C8.20001 10.3 8.20001 10.4 8.10001 10.5C8.10001 10.6 8.10001 10.7 8.20001 10.8C8.30001 10.9 8.30001 11 8.40001 11.1L8.50001 11.3C8.80001 11.7 9.10001 12.1 9.50001 12.5C9.90001 12.9 10.3 13.2 10.7 13.5C10.8 13.6 10.9 13.6 11 13.7C11.1 13.8 11.2 13.8 11.3 13.9C11.4 14 11.5 14 11.6 14C11.7 14 11.8 13.9 11.9 13.8L12.1 13.6C12.2 13.5 12.3 13.4 12.4 13.3C12.5 13.2 12.6 13.2 12.7 13.1C12.8 13 12.9 13 13 13C13.1 13 13.2 13 13.3 13.1C13.4 13.2 13.5 13.2 13.6 13.3L14.5 13.7C14.7 13.8 14.8 13.9 15 14C15.1 14.1 15.2 14.1 15.3 14.2C15.4 14.3 15.4 14.4 15.5 14.5C15.6 14.6 15.6 14.8 15.6 15C15.7 15.5 15.4 16 16.9 16.5Z" fill="white"/>
              </svg>
            </div>
          ) : (
            <RightOutlined style={{ color: '#a3e635' }} />
          )}
        </div>
      </div>
    );
  };

  // Get the correct card content based on layout
  const renderCardContent = () => {
    // Content to render inside the phone frame
    const cardContent = (
      <>
        {design.cardLayout === 'standard' && (
        <div 
          className="preview-card w-full h-full overflow-hidden flex flex-col"
          style={{ 
            backgroundColor: design.cardBackground,
            color: design.cardText,
          }}
        >
          {/* Background image (full height photo) */}
          <div className="card-background relative w-full h-[20em]">
            {avatarPreview ? (
              <div className="relative inset-0">
                <img 
                  src={avatarPreview} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div 
                  className="absolute bottom-0 w-full h-32"
                  style={{
                    background: 'linear-gradient(transparent, rgb(255, 255, 255))'
                  }}
                ></div>
              </div>
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center" 
                style={{ backgroundColor: design.headerBackground }}
              >
                <div className="text-white text-6xl opacity-20">
                  {getFormattedName().charAt(0)}
                </div>
                <div 
                  className="absolute bottom-0 w-full h-32"
                  style={{
                    background: 'linear-gradient(transparent, rgb(255, 255, 255))'
                  }}
                ></div>
              </div>
            )}
          </div>
          
          {/* Content starts here - below the background */}
          <div className="card-content mt-8">
            {/* Profile information */}
            <div className="profile-info text-center px-4 pb-4">
              <h2 className="text-[16px] font-bold mb-1">
                {getFormattedName()}
              </h2>
              <p className="text-[14px] text-gray-500 mb-4">
                {getFormattedTitle()}
              </p>
              
              <div className="mt-4 mb-6 px-3">
                {renderActionButtons()}
              </div>
            </div>
            
            {/* Links section */}
            <div className="links-section px-4">
              {links.length > 0 ? (
                links.map((link, index) => renderLinkItem(link, index))
              ) : (
                <div className="text-center p-8 text-gray-400">
                  No links added yet
                </div>
              )}
            </div>
            
            {/* Footer with powered by */}
            <div className="text-center text-gray-400 text-xs p-4 mt-auto">
              Powered by Bizcotap
            </div>
          </div>
        </div>
      )}
        {/* Card Type 2: Modern - Cover photo with profile picture */}
        {design.cardLayout === 'modern' && (
          <div 
            className="preview-card w-full h-full overflow-hidden"
            style={{ 
              backgroundColor: design.cardBackground,
              color: design.cardText,
            }}
          >
            {/* Header with cover photo */}
            <div 
              className="header-section relative" 
              style={{ height: '160px', backgroundColor: design.headerBackground }}
            >
              {/* Cover photo background */}
              {backgroundPreview && (
                <div className="absolute inset-0">
                  <img 
                    src={backgroundPreview} 
                    alt="Cover"
                    className="w-full h-full object-container"
                  />
                </div>
              )}
              
              {/* Profile photo - positioned to overlap header and content */}
              <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 flex justify-center z-10">
                <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Profile"
                      className="w-full h-full object-container"
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center" 
                      style={{ backgroundColor: '#f0f0f0' }}
                    >
                      <div className="text-gray-400 text-2xl">
                        {getFormattedName().charAt(0)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Content section with padding to accommodate the profile image */}
            <div className="content-section pt-16 pb-4">
              {/* Profile information */}
              <div className="profile-info text-center px-4">
                <h2 className="text-xl font-bold mb-1">
                  {getFormattedName()}
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                  {getFormattedTitle()}
                </p>
                
                <div className="mt-4 mb-6 px-2">
                  {renderActionButtons()}
                </div>
              </div>
              
              {/* Links section */}
              <div className="links-section px-3">
                {links.length > 0 ? (
                  links.map((link, index) => renderLinkItem(link, index))
                ) : (
                  <div className="text-center p-4 text-gray-400">
                    No links added yet
                  </div>
                )}
              </div>
              
              {/* Footer with powered by */}
              <div className="text-center text-gray-400 text-xs p-2 mt-auto">
                Powered by Bizcotap
              </div>
            </div>
          </div>
        )}
      </>
    );

    return cardContent;
  };

  // Add iPhone notch if needed
  const renderIphoneNotch = () => {
    if (isIphone) {
      return (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-7 bg-black rounded-b-xl z-10"></div>
      );
    }
    return null;
  };

  return (
    <div className="digital-card-preview-container">
      {/* Device toggle switch */}
      <div className="flex justify-center items-center mb-4">
        <span className={`mr-2 ${!isIphone ? 'font-bold' : 'text-gray-500'}`}>Android</span>
        <Switch 
          checked={isIphone}
          onChange={setIsIphone}
          className="bg-gray-300" 
          checkedChildren="iPhone"
          unCheckedChildren="Android"
        />
        <span className={`ml-2 ${isIphone ? 'font-bold' : 'text-gray-500'}`}>iPhone</span>
      </div>
      
      {/* Phone frame */}
      <div className={`phone-frame ${isIphone ? 'iphone-frame' : 'android-frame'}`} 
           style={{
             width: '280px',
             height: '560px',
             margin: '0 auto',
             position: 'relative',
             borderRadius: isIphone ? '40px' : '25px',
             border: isIphone ? '12px solid #000' : '10px solid #000',
             overflow: 'hidden',
             boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
           }}>
        
        {/* iPhone notch if needed */}
        {renderIphoneNotch()}
        
        {/* Status bar */}
        <div className="status-bar h-6 bg-black flex justify-between items-center px-5">
          <div className="text-white text-xs">9:41</div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-white mr-1"></div>
            <div className="h-2 w-2 rounded-full bg-white mr-1"></div>
            <div className="h-2 w-2 rounded-full bg-white"></div>
          </div>
        </div>
        
        {/* Card content container with scrolling */}
        <div className="content-container overflow-y-auto" style={{ height: 'calc(100% - 24px)' }}>
          {renderCardContent()}
        </div>
      </div>
    </div>
  );
};

export default DigitalCardPreview;