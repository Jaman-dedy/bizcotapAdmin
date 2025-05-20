'use client'  

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from 'antd/es/button';
import Typography from 'antd/es/typography';
import Card from 'antd/es/card';
import Checkbox from 'antd/es/checkbox';
import Radio from 'antd/es/radio';
import Upload from 'antd/es/upload';
import Image from 'antd/es/image';
import message from 'antd/es/message';
import Spin from 'antd/es/spin';
import Alert from 'antd/es/alert';
import Tabs from 'antd/es/tabs';
import { ArrowLeftOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useTagsContext } from '@/context/tags/TagsContext';
import HookUseTags from '@/hooks/useTags';
import { Tag } from '@/services/tagsService';

const { Title, Text } = Typography;

const backgroundLibrary = [
  { id: '1', src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBvZmZpY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60', name: 'Beach Office' },
  { id: '2', src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8b2ZmaWNlJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60', name: 'Modern Office' },
  { id: '3', src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW91bnRhaW4lMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', name: 'Mountain View' },
  { id: '4', src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG9mZmljZSUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60', name: 'Home Office Setup' },
  { id: '5', src: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWJzdHJhY3QlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', name: 'Abstract Colors' },
  { id: '6', src: 'https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YWJzdHJhY3QlMjBiYWNrZ3JvdW5kfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60', name: 'Gradient Blur' },
];

type TextItem = string | { text: string; isName: boolean };


const VirtualBackgroundPage = () => {
  const router = useRouter();
  const params = useParams();
  const tagId = typeof params?.tagId === 'string' ? params.tagId : Array.isArray(params?.tagId) ? params.tagId[0] : '';

  const { getFromCache, addToCache: addTagToCache } = useTagsContext();
  
  const { singleTag, isLoading: isLoadingTagFromApi, error: apiError } = HookUseTags(tagId);

  const [tag, setTag] = useState<Tag | null>(null);
  const [selectedBgImage, setSelectedBgImage] = useState('');
  const [qrColor, setQrColor] = useState('#000000');

  const [showQrCode, setShowQrCode] = useState(true);
  const [condensedView, setCondensedView] = useState(false);

  const [showName, setShowName] = useState(true);
  const [showJobTitle, setShowJobTitle] = useState(false);
  const [showCompany, setShowCompany] = useState(false);
  const [showEmail, setShowEmail] = useState(true);
  const [showPhone, setShowPhone] = useState(true);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tagId) {
      setIsLoading(false);
      return;
    }

    const cachedTag = getFromCache(tagId);
    if (cachedTag) {
      setTag(cachedTag);
      setIsLoading(false);
      return;
    }

    if (singleTag) {
      setTag(singleTag);
      addTagToCache(singleTag);
      setIsLoading(false);
    } else if (!isLoadingTagFromApi) {
      setIsLoading(false);
    }
  }, [tagId, singleTag]);

  useEffect(() => {
    if (backgroundLibrary.length > 0 && !selectedBgImage) {
      setSelectedBgImage(backgroundLibrary[0].src);
    }
  }, []);

  const generateQrCodeData = (tag: Tag | null) => {
    if (!tag) return '';
    
    let qrData = `https://link.bizcotap.com/profile/6829856056316e89705d98`;
    
    const additionalData = [];
    
    if (showEmail && tag.tagInfo?.email) {
      additionalData.push(`email:${tag.tagInfo.email}`);
    }
    
    if (showPhone && tag.tagInfo?.phone) {
      additionalData.push(`phone:${tag.tagInfo.phone}`);
    }
    
    if (additionalData.length > 0) {
      qrData += `?${additionalData.join('&')}`;
    }
    
    return qrData;
  };

const handleDownload = async () => {
  try {
    if (!tag || !selectedBgImage) {
      alert('Cannot generate background: Missing profile data or background image.');
      return;
    }

    const loadingElement = document.createElement('div');
    loadingElement.id = 'bg-loading-indicator';
    loadingElement.style.cssText = 'position:fixed;top:0;left:0;right:0;background:rgba(0,0,0,0.7);color:white;text-align:center;padding:10px;z-index:9999;';
    loadingElement.textContent = 'Generating background...';
    document.body.appendChild(loadingElement);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      document.body.removeChild(loadingElement);
      alert('Failed to create canvas context. Please try again or use a different browser.');
      return;
    }

    const outputWidth = 1920; 
    const outputHeight = 1080;
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    
    const bgImg = new window.Image();
    bgImg.crossOrigin = "anonymous";
    
    try {
      await new Promise<void>((resolve, reject) => {
        bgImg.onload = () => resolve();
        bgImg.onerror = (e) => {
          console.error("Background image loading error:", e);
          reject(new Error("Failed to load background image"));
        };
        bgImg.src = selectedBgImage;
      });
      
      ctx.drawImage(bgImg, 0, 0, outputWidth, outputHeight);
    } catch (error) {
      document.body.removeChild(loadingElement);
      alert('Error loading background image. Please try a different image.');
      return;
    }
    
    if (showQrCode) {
      const qrCodeSize = condensedView ? outputWidth * 0.075 : outputWidth * 0.1;
      const qrPadding = qrCodeSize * 0.05;
      const qrBoxSize = qrCodeSize + 2 * qrPadding;
      const qrMargin = condensedView ? outputWidth * 0.015 : outputWidth * 0.03;
      const qrX = outputWidth - qrBoxSize - qrMargin;
      const qrY = qrMargin;
      
      ctx.fillStyle = 'white';
      ctx.fillRect(qrX, qrY, qrBoxSize, qrBoxSize);
      
      ctx.strokeStyle = qrColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(qrX, qrY, qrBoxSize, qrBoxSize);
      
      const qrCodeUrl = generateQrCodeData(tag);
      const qrApiColor = qrColor.replace('#', '');
      const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${Math.floor(qrCodeSize)}x${Math.floor(qrCodeSize)}&data=${encodeURIComponent(qrCodeUrl)}&color=${qrApiColor}&bgcolor=FFFFFF&qzone=1&format=png`;
      
      try {
        const qrImg = new window.Image();
        qrImg.crossOrigin = "anonymous";
        
        await new Promise<void>((resolve, reject) => {
          qrImg.onload = () => resolve();
          qrImg.onerror = (e) => {
            console.error("QR code image loading error:", e);
            reject(new Error("Failed to load QR code"));
          };
          qrImg.src = qrImgUrl;
        });
        
        ctx.drawImage(qrImg, qrX + qrPadding, qrY + qrPadding, qrCodeSize, qrCodeSize);
      } catch (error) {
        console.error("Error loading QR code:", error);
      }
    }
    
    // Draw Text Information with TypeScript fixes
    if (showName || showJobTitle || showCompany || showEmail || showPhone) {
      ctx.fillStyle = 'white';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.shadowBlur = 3;
      
      let currentTextY = outputHeight - (condensedView ? outputHeight * 0.02 : outputHeight * 0.04);
      const textX = condensedView ? outputWidth * 0.02 : outputWidth * 0.04;
      const lineHeight = condensedView ? outputHeight * 0.035 : outputHeight * 0.045;
      
      // Prepare text items to draw with proper typing
      const textsToDraw: TextItem[] = [];
      
      if (showCompany && tag.tagInfo?.company) {
        textsToDraw.push(tag.tagInfo.company);
      }
      if (showJobTitle && tag.tagInfo?.position) {
        textsToDraw.push(tag.tagInfo.position);
      }
      if (showEmail && tag.tagInfo?.email) {
        textsToDraw.push(String(tag.tagInfo.email));
      }
      
      if (showPhone && tag.tagInfo?.phone) {
        textsToDraw.push(String(tag.tagInfo.phone));
      }
      if (showName) {
        const nameText = `${tag.tagInfo?.fname || ''} ${tag.tagInfo?.lname || ''}`.trim();
        textsToDraw.push({ text: nameText, isName: true });
      }
      
      for (let i = 0; i < textsToDraw.length; i++) {
        const item = textsToDraw[i];
        let text: string;
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
    
    try {
      const dataUrl = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `virtual-background-${tag.tagInfo?.fname || 'user'}-${tag.tagInfo?.lname || ''}.png`.trim();
      
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      document.body.removeChild(loadingElement);
      
      const successElement = document.createElement('div');
      successElement.style.cssText = 'position:fixed;top:0;left:0;right:0;background:rgba(82,196,26,0.9);color:white;text-align:center;padding:10px;z-index:9999;';
      successElement.textContent = 'Background downloaded successfully!';
      document.body.appendChild(successElement);
      
      setTimeout(() => {
        if (document.body.contains(successElement)) {
          document.body.removeChild(successElement);
        }
      }, 3000);
    } catch (downloadError) {
      console.error("Error in download process:", downloadError);
      document.body.removeChild(loadingElement);
      alert("Failed to create or download the image. Please try again.");
    }
  } catch (error) {
    console.error("Error generating background:", error);
    
    const loadingElement = document.getElementById('bg-loading-indicator');
    if (loadingElement && document.body.contains(loadingElement)) {
      document.body.removeChild(loadingElement);
    }
    
    alert(`Failed to generate background: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
  }
};


  if (typeof window !== 'undefined' && (isLoading || isLoadingTagFromApi)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading profile data..." />
      </div>
    );
  }

  if (typeof window !== 'undefined' && !tag && !isLoadingTagFromApi) {
    return (
      <div className="p-6 text-center">
        <Alert
          message="Error Loading Profile"
          description={apiError || "Could not load profile data. Please try again."}
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
          Create a personalized virtual background for {tag?.tagInfo?.fname || ''} {tag?.tagInfo?.lname || ''}
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
                  <Checkbox 
                    checked={showEmail} 
                    onChange={e => setShowEmail(e.target.checked)}
                    className="block"
                  >
                    <span className="font-medium">Email</span>
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
                  <Checkbox 
                    checked={showPhone} 
                    onChange={e => setShowPhone(e.target.checked)}
                    className="block"
                  >
                    <span className="font-medium">Phone</span>
                  </Checkbox>
                </div>
              </div>
            </div>
          </Card>

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
                    reader.onload = (e) => {
                      if (e.target && typeof e.target.result === 'string') {
                        setSelectedBgImage(e.target.result);
                      }
                    };
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
                    
                    {(showName || showJobTitle || showCompany || showEmail || showPhone) && tag && (
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        {showName && (
                          <div className={`font-bold ${condensedView ? 'text-lg' : 'text-2xl'} text-shadow`}>
                            {tag.tagInfo?.fname || ''} {tag.tagInfo?.lname || ''}
                          </div>
                        )}
                        {showJobTitle && tag.tagInfo?.position && (
                          <div className={`${condensedView ? 'text-sm' : 'text-base'} text-shadow`}>
                            {tag.tagInfo.position}
                          </div>
                        )}
                        {showCompany && tag.tagInfo?.company && (
                          <div className={`${condensedView ? 'text-sm' : 'text-base'} text-shadow`}>
                            {tag.tagInfo.company}
                          </div>
                        )}
                        {showEmail && tag.tagInfo?.email && (
                          <div className={`${condensedView ? 'text-sm' : 'text-base'} text-shadow`}>
                            {tag.tagInfo.email}
                          </div>
                        )}
                        {showPhone && tag.tagInfo?.phone && (
                          <div className={`${condensedView ? 'text-sm' : 'text-base'} text-shadow`}>
                            {tag.tagInfo.phone}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {showQrCode && tag && (
                      <div className={`absolute top-3 right-3 bg-white p-1 rounded-md border-2 ${condensedView ? 'w-16 h-16' : 'w-24 h-24'}`} style={{ borderColor: qrColor }}>
                        <Image
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generateQrCodeData(tag))}&color=${qrColor.replace('#','')}&bgcolor=FFFFFF`}
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
              <Text type="secondary" className="text-xs mt-1">
                QR code now includes {showEmail ? 'email' : ''}{showEmail && showPhone ? ' and ' : ''}{showPhone ? 'phone number' : ''} information for enhanced lead generation.
              </Text>
            </div>
          </Card>
        </div>
      </div>
      
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
  style.id = styleTagId
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