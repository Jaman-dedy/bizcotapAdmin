'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Typography, Card, Checkbox, Radio, Upload, Image, message, Spin, Alert, Tabs } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useTagsContext } from '@/context/tags/TagsContext';
import HookUseTags from '@/hooks/useTags';
import { Tag } from '@/services/tagsService';

const { Title, Text } = Typography;

// Dummy Tag Data for Demo
const DUMMY_TAG_ID = 999;
const dummyTagData: Tag = {
  id: DUMMY_TAG_ID,
  tuid: `dummy-tuid-${DUMMY_TAG_ID}`,
  tagInfo: {
    fname: "Demo",
    lname: "User",
    position: "Software Engineer",
    company: "BizcoTech Inc.",
    avatar: null,
    emails: [{ type: "work", value: "demo.user@bizcotech.com" }],
    phones: [{ type: "work", value: "+1234567890" }],
    websites: [{ type: "company", value: "https://bizcotech.com" }],
    addresses: [],
    dob: null,
    notes: "This is dummy data for demo purposes.",
    title: "Mr."
  },
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  privacyPolicyAccepted: true,
  privacyPolicyVersion: "1.0",
  privacyAcceptedDate: new Date().toISOString(),
  userId: 100,
  companyId: 200,
  tagOrderId: null,
  user: {
    id: 100,
    email: "dummy.user@example.com",
    firstName: "Demo",
    lastName: "User"
  },
  company: null,
};

// Background library - static data
const backgroundLibrary = [
  { id: '1', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBvZmZpY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60', name: 'Beach Office' },
  { id: '2', src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8b2ZmaWNlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60', name: 'Modern Office' },
  { id: '3', src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW91bnRhaW4lMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', name: 'Mountain View' },
  { id: '4', src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG9mZmljZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60', name: 'Home Office Setup' },
  { id: '5', src: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWJzdHJhY3QlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', name: 'Abstract Colors' },
  { id: '6', src: 'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YWJzdHJhY3QlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', name: 'Gradient Blur' },
];

const VirtualBackgroundPage = () => {
  const router = useRouter();
  const params = useParams();
  const tagId = params.tagId as string;

  const { getFromCache, addToCache: addTagToCache } = useTagsContext();
  const tagsHookData = HookUseTags();
  const { fetchTagById, isLoading: isLoadingTagFromApi, error: apiError } = tagsHookData;

  const [tag, setTag] = useState<Tag | null>(null);
  const [selectedBgImage, setSelectedBgImage] = useState<string>('');
  const [qrColor, setQrColor] = useState<string>('#000000');

  const [showQrCode, setShowQrCode] = useState<boolean>(true);
  const [condensedView, setCondensedView] = useState<boolean>(false);

  const [showName, setShowName] = useState<boolean>(true);
  const [showJobTitle, setShowJobTitle] = useState<boolean>(false);
  const [showCompany, setShowCompany] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load tag data from cache or API
  useEffect(() => {
    if (tagId) {
      setIsLoading(true);
      // Try to get from cache first
      const cachedTag = getFromCache(tagId);
      
      if (cachedTag) {
        setTag(cachedTag);
        setIsLoading(false);
      } else {
        // Not in cache, fetch from API
        const fetchAsync = async () => {
          if (typeof fetchTagById === 'function') {
            try {
              const fetchedTag = await fetchTagById(tagId);
              if (fetchedTag) {
                setTag(fetchedTag);
                addTagToCache(fetchedTag);
              } else {
                console.warn("API returned no tag data. Using dummy data.");
                setTag(dummyTagData);
              }
            } catch (error) {
              console.error("Error fetching tag:", error);
              setTag(dummyTagData);
            }
          } else {
            console.error('fetchTagById is not a function');
            setTag(dummyTagData);
          }
          setIsLoading(false);
        };
        
        fetchAsync();
      }
    } else {
      setIsLoading(false);
    }
  }, [tagId, getFromCache, fetchTagById, addTagToCache]);

  // Set default background image
  useEffect(() => {
    if (backgroundLibrary.length > 0 && !selectedBgImage) {
      setSelectedBgImage(backgroundLibrary[0].src);
    }
  }, [selectedBgImage]);

  // Generate and download the virtual background
  const handleDownload = async () => {
    if (!tag || !selectedBgImage) {
      message.error('Cannot generate background: Missing data.');
      return;
    }

    message.loading({ content: 'Generating background...', key: 'generating_bg', duration: 0 });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      message.error('Failed to create canvas context.');
      message.destroy('generating_bg');
      return;
    }

    const outputWidth = 1920; // Full HD width
    const outputHeight = 1080; // Full HD height
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // 1. Draw Background Image
    try {
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        bgImg.onload = resolve;
        bgImg.onerror = reject;
        bgImg.src = selectedBgImage;
      });
      
      ctx.drawImage(bgImg, 0, 0, outputWidth, outputHeight);
      
      // 2. Draw QR Code if enabled
      if (showQrCode) {
        const qrCodeSize = condensedView ? outputWidth * 0.075 : outputWidth * 0.1;
        const qrPadding = qrCodeSize * 0.05;
        const qrBoxSize = qrCodeSize + 2 * qrPadding;
        const qrMargin = condensedView ? outputWidth * 0.015 : outputWidth * 0.03;
        const qrX = outputWidth - qrBoxSize - qrMargin;
        const qrY = qrMargin;
        
        // Draw white background for QR code
        ctx.fillStyle = 'white';
        ctx.fillRect(qrX, qrY, qrBoxSize, qrBoxSize);
        
        // Draw border for QR code
        ctx.strokeStyle = qrColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(qrX, qrY, qrBoxSize, qrBoxSize);
        
        // Generate QR code
        const qrCodeUrl = `https://link.bizcotap.com/profile/${tag.id}`;
        const qrApiColor = qrColor.replace('#', '');
        const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${Math.floor(qrCodeSize)}x${Math.floor(qrCodeSize)}&data=${encodeURIComponent(qrCodeUrl)}&color=${qrApiColor}&bgcolor=FFFFFF&qzone=1&format=png`;
        
        const qrImg = new Image();
        qrImg.crossOrigin = "anonymous";
        
        await new Promise((resolve, reject) => {
          qrImg.onload = resolve;
          qrImg.onerror = reject;
          qrImg.src = qrImgUrl;
        });
        
        ctx.drawImage(qrImg, qrX + qrPadding, qrY + qrPadding, qrCodeSize, qrCodeSize);
      }
      
      // 3. Draw Text Information
      if (showName || showJobTitle || showCompany) {
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 3;
        
        let currentTextY = outputHeight - (condensedView ? outputHeight * 0.02 : outputHeight * 0.04);
        const textX = condensedView ? outputWidth * 0.02 : outputWidth * 0.04;
        const lineHeight = condensedView ? outputHeight * 0.035 : outputHeight * 0.045;
        
        const textsToDraw = [];
        if (showCompany && tag.tagInfo.company) {
          textsToDraw.push(tag.tagInfo.company);
        }
        if (showJobTitle && tag.tagInfo.position) {
          textsToDraw.push(tag.tagInfo.position);
        }
        if (showName) {
          const nameText = `${tag.tagInfo.fname} ${tag.tagInfo.lname}`;
          textsToDraw.push({ text: nameText, isName: true });
        }
        
        for (let i = 0; i < textsToDraw.length; i++) {
          const item = textsToDraw[i];
          let text;
          let isName = false;
          
          if (typeof item === 'string') {
            text = item;
          } else {
            text = item.text;
            isName = item.isName;
          }
          
          if (isName) {
            ctx.font = condensedView ? `bold ${outputHeight * 0.035}px Arial` : `bold ${outputHeight * 0.045}px Arial`;
          } else {
            ctx.font = condensedView ? `${outputHeight * 0.03}px Arial` : `${outputHeight * 0.04}px Arial`;
          }
          
          ctx.fillText(text, textX, currentTextY);
          currentTextY -= lineHeight;
        }
      }
      
      // 4. Trigger Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `virtual-background-${tag.tagInfo.fname}-${tag.tagInfo.lname}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success({ content: 'Background downloaded successfully!', key: 'generating_bg' });
      
    } catch (error) {
      console.error("Error generating background:", error);
      message.error({ content: 'Failed to generate background. Please try again.', key: 'generating_bg' });
    }
  };

  // Loading state
  if (isLoading || isLoadingTagFromApi) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading profile data..." />
      </div>
    );
  }

  // Error state
  if (!tag) {
    return (
      <div className="p-6 text-center">
        <Alert
          message="Error Loading Profile"
          description="Could not load profile data. Please try again."
          type="error"
          showIcon
          className="mb-4"
        />
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/companyAdmin/profiles')}
        >
          Back to Profiles
        </Button>
      </div>
    );
  }
  // Main UI
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back button and header */}
      <div className="mb-8">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
          size="large"
          className="mb-4 hover:bg-gray-100 transition-colors"
        >
          Back to Profiles
        </Button>
        <Title level={2} className="mb-1">Virtual Background Creator</Title>
        <Text type="secondary" className="text-lg">
          Create a personalized virtual background for {tag.tagInfo.fname} {tag.tagInfo.lname}
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Controls */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-md border border-gray-200 overflow-hidden">
            <Title level={4} className="mb-6">Customize Your Background</Title>
            
            {/* QR Code Color Selector */}
            <div className="mb-8">
              <Text strong className="text-base mb-3 block">Choose QR color</Text>
              <Radio.Group 
                value={qrColor} 
                onChange={e => setQrColor(e.target.value)}
                className="flex flex-wrap gap-3"
              >
                <Radio.Button value="#FFFFFF" className="rounded-full p-0 overflow-hidden border-2 border-gray-300">
                  <div className="w-8 h-8 bg-white flex items-center justify-center">
                    {qrColor === '#FFFFFF' && <div className="w-2 h-2 bg-black rounded-full" />}
                  </div>
                </Radio.Button>
                <Radio.Button value="#000000" className="rounded-full p-0 overflow-hidden border-2 border-gray-300">
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    {qrColor === '#000000' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </Radio.Button>
                <Radio.Button value="#FF4D4F" className="rounded-full p-0 overflow-hidden border-2 border-gray-300">
                  <div className="w-8 h-8 bg-red-500 flex items-center justify-center">
                    {qrColor === '#FF4D4F' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </Radio.Button>
                <Radio.Button value="#FF8800" className="rounded-full p-0 overflow-hidden border-2 border-gray-300">
                  <div className="w-8 h-8 bg-orange-500 flex items-center justify-center">
                    {qrColor === '#FF8800' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </Radio.Button>
                <Radio.Button value="#52C41A" className="rounded-full p-0 overflow-hidden border-2 border-gray-300">
                  <div className="w-8 h-8 bg-green-500 flex items-center justify-center">
                    {qrColor === '#52C41A' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </Radio.Button>
                <Radio.Button value="#1890FF" className="rounded-full p-0 overflow-hidden border-2 border-gray-300">
                  <div className="w-8 h-8 bg-blue-500 flex items-center justify-center">
                    {qrColor === '#1890FF' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </Radio.Button>
                <Radio.Button value="#722ED1" className="rounded-full p-0 overflow-hidden border-2 border-gray-300">
                  <div className="w-8 h-8 bg-purple-500 flex items-center justify-center">
                    {qrColor === '#722ED1' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </Radio.Button>
              </Radio.Group>
            </div>
            
            {/* Display Options */}
            <div className="mb-8">
              <Text strong className="text-base mb-3 block">Display Options</Text>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Checkbox 
                    checked={showQrCode} 
                    onChange={e => setShowQrCode(e.target.checked)}
                    className="block"
                  >
                    <span className="font-medium">QR Code</span>
                    <div className="text-xs text-gray-500">QR Code can be customized in the QR Code section</div>
                  </Checkbox>
                  <Checkbox 
                    checked={showName} 
                    onChange={e => setShowName(e.target.checked)}
                    className="block"
                  >
                    <span className="font-medium">Name</span>
                  </Checkbox>
                  <Checkbox 
                    checked={showJobTitle} 
                    onChange={e => setShowJobTitle(e.target.checked)}
                    className="block"
                  >
                    <span className="font-medium">Job Title</span>
                  </Checkbox>
                </div>
                <div className="space-y-3">
                  <Checkbox 
                    checked={condensedView} 
                    onChange={e => setCondensedView(e.target.checked)}
                    className="block"
                  >
                    <span className="font-medium">Condensed view</span>
                    <div className="text-xs text-gray-500">Optimal for Microsoft Teams</div>
                  </Checkbox>
                  <Checkbox 
                    checked={showCompany} 
                    onChange={e => setShowCompany(e.target.checked)}
                    className="block"
                  >
                    <span className="font-medium">Company</span>
                  </Checkbox>
                </div>
              </div>
            </div>
          </Card>

          {/* Background Selection */}
          <Card className="shadow-md border border-gray-200">
            <Tabs defaultActiveKey="1" className="mb-4">
              <Tabs.TabPane tab="Choose from library" key="1">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {backgroundLibrary.map((bg) => (
                    <div 
                      key={bg.id}
                      onClick={() => setSelectedBgImage(bg.src)}
                      className={`
                        cursor-pointer rounded-lg overflow-hidden border-2 transition-all
                        ${selectedBgImage === bg.src ? 'border-blue-500 shadow-md scale-105' : 'border-transparent hover:border-gray-300'}
                      `}
                    >
                      <div className="aspect-video relative">
                        <Image
                          src={bg.src}
                          alt={bg.name}
                          className="object-cover"
                          preview={false}
                        />
                        {selectedBgImage === bg.src && (
                          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                            <div className="bg-white rounded-full p-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="text-xs p-1 text-center text-gray-600">{bg.name}</div>
                    </div>
                  ))}
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Upload image" key="2">
                <Upload.Dragger
                  name="file"
                  multiple={false}
                  showUploadList={false}
                  beforeUpload={(file) => {
                    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                      message.error('You can only upload JPG/PNG files!');
                      return Upload.LIST_IGNORE;
                    }
                    const reader = new FileReader();
                    reader.onload = () => setSelectedBgImage(reader.result as string);
                    reader.readAsDataURL(file);
                    return false;
                  }}
                  className="mb-4"
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined className="text-3xl text-blue-500" />
                  </p>
                  <p className="ant-upload-text">Click or drag image to this area to upload</p>
                  <p className="ant-upload-hint text-xs">
                    Supports JPG, PNG. For best results, use an image with 16:9 aspect ratio.
                  </p>
                </Upload.Dragger>
              </Tabs.TabPane>
            </Tabs>
          </Card>
        </div>

        {/* Right Column - Preview and Download */}
        <div className="lg:col-span-7">
          <Card className="shadow-lg border border-gray-200 overflow-hidden">
            <div className="mb-4">
              <Title level={4}>Virtual background preview</Title>
            </div>
            
            <div className="relative rounded-lg overflow-hidden border border-gray-200 mb-6">
              <div className="aspect-video bg-gray-100 relative">
                {selectedBgImage ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={selectedBgImage}
                      alt="Selected background"
                      className="object-cover w-full h-full"
                      preview={false}
                    />
                    
                    {/* Preview overlay with name, position, etc. */}
                    {(showName || showJobTitle || showCompany) && (
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        {showName && (
                          <div className={`font-bold ${condensedView ? 'text-lg' : 'text-2xl'} text-shadow`}>
                            {tag.tagInfo.fname} {tag.tagInfo.lname}
                          </div>
                        )}
                        {showJobTitle && tag.tagInfo.position && (
                          <div className={`${condensedView ? 'text-sm' : 'text-base'} text-shadow`}>
                            {tag.tagInfo.position}
                          </div>
                        )}
                        {showCompany && tag.tagInfo.company && (
                          <div className={`${condensedView ? 'text-sm' : 'text-base'} text-shadow`}>
                            {tag.tagInfo.company}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* QR Code preview */}
                    {showQrCode && (
                      <div className={`absolute top-3 right-3 bg-white p-1 rounded-md border-2 ${condensedView ? 'w-16 h-16' : 'w-24 h-24'}`} style={{ borderColor: qrColor }}>
                        <Image
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://link.bizcotap.com/profile/${tag.id}`)}&color=${qrColor.replace('#','')}&bgcolor=FFFFFF`}
                          alt="QR Code"
                          className="w-full h-full"
                          preview={false}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Text type="secondary">Please select a background image</Text>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <Text type="secondary" className="text-sm">
                  This preview is an approximation. The final image may vary slightly.
                </Text>
              </div>
              <Button 
                type="primary" 
                icon={<DownloadOutlined />} 
                size="large"
                onClick={handleDownload}
                disabled={!selectedBgImage || !tag}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Download background
              </Button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <Text type="secondary" className="text-sm">
                  Lead capture mode is on
                </Text>
              </div>
              <Text type="secondary" className="text-xs mt-1">
                When someone scans this QR code, their contact information will be captured in your leads section.
              </Text>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="mt-8 flex justify-between">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
        >
          Prev
        </Button>
        <Button 
          type="primary" 
          onClick={() => message.info('Next step functionality will be implemented soon.')}
        >
          Next <ArrowLeftOutlined style={{ transform: 'rotate(180deg)' }} />
        </Button>
      </div>
    </div>
  );
};

export default VirtualBackgroundPage;

const styleTagId = 'virtual-background-page-styles';
if (typeof document !== 'undefined' && !document.getElementById(styleTagId)) {
  const style = document.createElement('style');
  style.id = styleTagId;
  style.innerHTML = `
    .ant-radio-button-wrapper {
        line-height: 28px; /* Align checkmark better */
    }
    .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within {
        box-shadow: none; /* Optional: remove focus shadow if not desired */
    }
    .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: #1890ff;
      font-weight: 500;
    }
    .text-shadow {
      text-shadow: 0 1px 3px rgba(0,0,0,0.7);
    }
  `;
  document.head.appendChild(style);
}
