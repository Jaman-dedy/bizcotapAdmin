'use client'  

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from 'antd/es/button';
import Typography from 'antd/es/typography';
import Card from 'antd/es/card';
import Checkbox from 'antd/es/checkbox';
import Upload from 'antd/es/upload';
import Image from 'antd/es/image';
import message from 'antd/es/message';
import Spin from 'antd/es/spin';
import Alert from 'antd/es/alert';
import Switch from 'antd/es/switch';
import Input from 'antd/es/input';
import Tooltip from 'antd/es/tooltip';
import Modal from 'antd/es/modal';
import { 
  ArrowLeftOutlined, 
  DownloadOutlined, 
  UploadOutlined, 
  InfoCircleOutlined, 
  CopyOutlined, 
  QuestionCircleOutlined,
  MailOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { useTagsContext } from '@/context/tags/TagsContext';
import HookUseTags from '@/hooks/useTags';
import { Tag } from '@/services/tagsService';

const { Title, Text, Paragraph } = Typography;

type TextItem = string | { text: string; isName: boolean };

const EmailSignaturePage = () => {
  const router = useRouter();
  const params = useParams();
  const tagId = typeof params?.tagId === 'string' ? params.tagId : Array.isArray(params?.tagId) ? params.tagId[0] : '';

  const { getFromCache, addToCache: addTagToCache } = useTagsContext();
  
  const { singleTag, isLoading: isLoadingTagFromApi, error: apiError } = HookUseTags(tagId);

  const [tag, setTag] = useState<Tag | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>('');
  const [qrCodeLogoUrl, setQrCodeLogoUrl] = useState<string>('');
  const [bannerImageUrl, setBannerImageUrl] = useState<string>('');
  const [bannerLink, setBannerLink] = useState<string>('');
  
  const [includeBanner, setIncludeBanner] = useState<boolean>(false);
  const [previewEmailModal, setPreviewEmailModal] = useState<boolean>(false);
  const [htmlSignature, setHtmlSignature] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const [showName, setShowName] = useState<boolean>(true);
  const [showJobTitle, setShowJobTitle] = useState<boolean>(true);
  const [showCompany, setShowCompany] = useState<boolean>(true);
  const [showPhone, setShowPhone] = useState<boolean>(true);
  const [showEmail, setShowEmail] = useState<boolean>(true);
  const [showAddress, setShowAddress] = useState<boolean>(false);
  const [showSocialIcons, setShowSocialIcons] = useState<boolean>(true);
  const [showQrCode, setShowQrCode] = useState<boolean>(true);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [emailSent, setEmailSent] = useState<boolean>(false);

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
  }, [tagId, singleTag, isLoadingTagFromApi, getFromCache, addTagToCache]);

  useEffect(() => {
    // Generate HTML signature whenever relevant states change
    if (tag) {
      generateHtmlSignature();
    }
  }, [
    tag, profilePictureUrl, companyLogoUrl, qrCodeLogoUrl, 
    includeBanner, bannerImageUrl, bannerLink, 
    showName, showJobTitle, showCompany, showPhone, 
    showEmail, showAddress, showSocialIcons, showQrCode
  ]);

  const generateQrCodeData = (tag: Tag | null) => {
    if (!tag) return '';
    
    let qrData = `https://link.bizcotap.com/profile/${tagId}`;
    
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

  const generateHtmlSignature = () => {
    if (!tag) return;

    // Create HTML signature based on selected options
    const fullName = `${tag.tagInfo?.fname || ''} ${tag.tagInfo?.lname || ''}`.trim();
    const jobTitle = tag.tagInfo?.position || '';
    const company = tag.tagInfo?.company || '';
    const phone = tag.tagInfo?.phone || '';
    const email = tag.tagInfo?.email || '';
    
    // QR code URL with proper encoding
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(generateQrCodeData(tag))}&color=000000&bgcolor=FFFFFF`;

    // Build HTML with conditional elements
    let html = `
      <table style="font-family: Arial, sans-serif; border-collapse: collapse; max-width: 600px;">
        <tr>
          <td style="vertical-align: top; padding-right: 15px;">
            ${profilePictureUrl ? `<img src="${profilePictureUrl}" alt="Profile Picture" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">` : ''}
          </td>
          <td style="vertical-align: top; padding-right: ${showQrCode ? '15px' : '0px'};">
            ${showName ? `<p style="font-size: 18px; font-weight: bold; margin: 0 0 5px 0;">${fullName}</p>` : ''}
            ${showJobTitle && jobTitle ? `<p style="font-size: 14px; margin: 0 0 5px 0; color: #666;">${jobTitle}</p>` : ''}
            ${showCompany && company ? `<p style="font-size: 14px; margin: 0 0 10px 0;">${company}</p>` : ''}
            ${companyLogoUrl ? `<img src="${companyLogoUrl}" alt="Company Logo" style="max-height: 40px; max-width: 150px; margin-bottom: 10px;">` : ''}
            
            <table style="border-collapse: collapse; margin-top: 5px;">
              ${showPhone && phone ? `
                <tr>
                  <td style="padding: 2px 0;">
                    <img src="https://cdn-icons-png.flaticon.com/512/455/455705.png" alt="Phone" style="width: 14px; height: 14px; margin-right: 5px; vertical-align: middle;">
                    <a href="tel:${phone}" style="color: #333; text-decoration: none; font-size: 13px;">${phone}</a>
                  </td>
                </tr>
              ` : ''}
              
              ${showEmail && email ? `
                <tr>
                  <td style="padding: 2px 0;">
                    <img src="https://cdn-icons-png.flaticon.com/512/482/482138.png" alt="Email" style="width: 14px; height: 14px; margin-right: 5px; vertical-align: middle;">
                    <a href="mailto:${email}" style="color: #333; text-decoration: none; font-size: 13px;">${email}</a>
                  </td>
                </tr>
              ` : ''}
              
              ${showAddress && tag.tagInfo?.addresses ? `
                <tr>
                  <td style="padding: 2px 0;">
                    <img src="https://cdn-icons-png.flaticon.com/512/1275/1275302.png" alt="Location" style="width: 14px; height: 14px; margin-right: 5px; vertical-align: middle;">
                    <span style="color: #333; font-size: 13px;">${tag.tagInfo.addresses}</span>
                  </td>
                </tr>
              ` : ''}
            </table>
            
            ${showSocialIcons ? `
              <div style="margin-top: 10px;">
                <a href="https://linkedin.com" style="text-decoration: none; margin-right: 8px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" style="width: 18px; height: 18px;">
                </a>
                <a href="https://twitter.com" style="text-decoration: none; margin-right: 8px;">
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 18px; height: 18px;">
                </a>
                <a href="https://facebook.com" style="text-decoration: none;">
                  <img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" alt="Facebook" style="width: 18px; height: 18px;">
                </a>
              </div>
            ` : ''}
          </td>
          ${showQrCode ? `
            <td style="vertical-align: top; text-align: right;">
              <div style="display: inline-block; text-align: center;">
                ${qrCodeLogoUrl ? `<img src="${qrCodeLogoUrl}" alt="QR Code Logo" style="width: 30px; height: 30px; margin-bottom: 5px;">` : ''}
                <img src="${qrCodeUrl}" alt="QR Code" style="width: 80px; height: 80px; display: block;">
                <span style="font-size: 10px; color: #666; display: block; margin-top: 2px;">My Digital Business Card</span>
              </div>
            </td>
          ` : ''}
        </tr>
        ${includeBanner && bannerImageUrl ? `
          <tr>
            <td colspan="3" style="padding-top: 15px;">
              ${bannerLink ? `<a href="${bannerLink}" target="_blank">` : ''}
                <img src="${bannerImageUrl}" alt="Banner" style="max-width: 100%; height: auto; border: 0;">
              ${bannerLink ? '</a>' : ''}
            </td>
          </tr>
        ` : ''}
      </table>
    `;

    setHtmlSignature(html);
  };

  const handleCopyHtml = () => {
    if (htmlSignature) {
      navigator.clipboard.writeText(htmlSignature)
        .then(() => {
          setCopySuccess(true);
          message.success('HTML copied to clipboard!');
          setTimeout(() => setCopySuccess(false), 3000);
        })
        .catch(() => {
          message.error('Failed to copy HTML');
        });
    }
  };

  const handleSendToEmail = () => {
    // Simulate sending to email
    setEmailSent(true);
    message.success('Signature has been sent to your email!');
    setTimeout(() => setEmailSent(false), 5000);
  };
  
  const handleImageUpload = (
    file: File, 
    setter: React.Dispatch<React.SetStateAction<string>>
  ): boolean => {
    if (file.size > 5 * 1024 * 1024) {
      message.error('Image must be smaller than 5MB!');
      return false;
    }
    
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      message.error('You can only upload JPG/PNG/GIF files!');
      return false;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setter(e.target.result);
      }
    };
    reader.readAsDataURL(file);
    
    return false; // Prevent default upload behavior
  };

  if (typeof window !== 'undefined' && (isLoading || isLoadingTagFromApi)) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* <Spin size="large" tip="Loading profile data..." /> */}spin
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
          Back to Profile
        </Button>
        <Title level={2} className="mb-1">Email Signature</Title>
        <p  className="">
          Create a professional email signature for {tag?.tagInfo?.fname || ''} {tag?.tagInfo?.lname || ''}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Controls */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="shadow-md border border-gray-200 overflow-hidden">
            <Title level={4} className="mb-6">Email Signature Elements</Title>
            
            {/* Profile Picture Upload */}
            <div className="mb-6 ">
              <div className="flex items-center justify-between mb-2">
                <Text strong className="text-base">Profile picture</Text>
                <Tooltip title="Upload a professional headshot for a personal touch">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </div>
              <Upload
                name="avatar"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={(file) => handleImageUpload(file, setProfilePictureUrl)}
              >
                {profilePictureUrl ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    <Image
                      src={profilePictureUrl}
                      alt="avatar"
                      className="w-full h-full object-cover"
                      preview={false}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <UploadOutlined className="text-xl mb-1" />
                    <div className="text-xs text-center">
                      Select file or drag<br />and drop one here
                    </div>
                  </div>
                )}
              </Upload>
            </div>
            
            {/* Company Logo Upload */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Text strong className="text-base">Company logo</Text>
                <Tooltip title="Add your company logo for brand recognition">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </div>
              <Upload
                name="logo"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={(file) => handleImageUpload(file, setCompanyLogoUrl)}
              >
                {companyLogoUrl ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    <Image
                      src={companyLogoUrl}
                      alt="company logo"
                      className="w-full h-full object-cover"
                      preview={false}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <UploadOutlined className="text-xl mb-1" />
                    <div className="text-xs text-center">
                      Select file or drag<br />and drop one here
                    </div>
                  </div>
                )}
              </Upload>
            </div>
            
            {/* QR Code Logo Upload */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Text strong className="text-base">QR Code logo</Text>
                <Tooltip title="Add a small logo to display above the QR code">
                  <InfoCircleOutlined className="text-gray-400" />
                </Tooltip>
              </div>
              <Upload
                name="qrlogo"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={(file) => handleImageUpload(file, setQrCodeLogoUrl)}
              >
                {qrCodeLogoUrl ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    <Image
                      src={qrCodeLogoUrl}
                      alt="QR code logo"
                      className="w-full h-full object-cover"
                      preview={false}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <UploadOutlined className="text-xl mb-1" />
                    <div className="text-xs text-center">
                      Select file or drag<br />and drop one here
                    </div>
                  </div>
                )}
              </Upload>
            </div>
            
            {/* Banner Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Text strong className="text-base">Include Banner</Text>
                <Switch 
                  checked={includeBanner} 
                  onChange={setIncludeBanner}
                  size="small"
                />
              </div>
              
              {includeBanner && (
                <>
                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <Upload
                      name="banner"
                      listType="picture"
                      className="w-full"
                      showUploadList={false}
                      beforeUpload={(file) => handleImageUpload(file, setBannerImageUrl)}
                    >
                      {bannerImageUrl ? (
                        <div className="relative w-full aspect-[4/1] rounded overflow-hidden mb-3">
                          <Image
                            src={bannerImageUrl}
                            alt="banner"
                            className="w-full h-full object-cover"
                            preview={false}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-blue-500 transition-colors">
                          <UploadOutlined className="text-xl mb-1" />
                          <div className="text-sm text-center">
                            Select file or drag and drop one here
                          </div>
                        </div>
                      )}
                    </Upload>
                    
                    <div className="mt-3">
                      <Text className="text-sm mb-1 block">Banner link (optional)</Text>
                      <Input
                        placeholder="https://example.com/promotion"
                        value={bannerLink}
                        onChange={(e) => setBannerLink(e.target.value)}
                        prefix={<LinkOutlined className="text-gray-400" />}
                        className="w-full"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Display Options */}
            <div className="mb-6">
              <Text strong className="text-base mb-3 block">Display Options</Text>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Checkbox 
                    checked={showName} 
                    onChange={(e) => setShowName(e.target.checked)}
                    className="block"
                  >
                    <span className="font-medium">Name</span>
                  </Checkbox>
                  <Checkbox 
                    checked={showJobTitle} 
                    onChange={(e) => setShowJobTitle(e.target.checked)}
                    className="block"
                  >
                    <span className="font-medium">Job Title</span>
                  </Checkbox>
                  <Checkbox 
                    checked={showCompany} 
                    onChange={(e) => setShowCompany(e.target.checked)}
                    className="block"
                  >
                    <span className="font-medium">Company</span>
                  </Checkbox>
                  <Checkbox 
                    checked={showSocialIcons} 
                    onChange={(e) => setShowSocialIcons(e.target.checked)}
                    className="block"
                  >
                    <span className="font-medium">Social Icons</span>
                  </Checkbox>
                </div>
                <div className="space-y-3">
                  <Checkbox 
                    checked={showEmail} 
                    onChange={(e) => setShowEmail(e.target.checked)}
                    className="block"
                  >
                    <span className="font-medium">Email</span>
                  </Checkbox>
                  <Checkbox 
                    checked={showPhone} 
                    onChange={(e) => setShowPhone(e.target.checked)}
                    className="block"
                  >
                    <span className="font-medium">Phone</span>
                  </Checkbox>
                  <Checkbox 
                    checked={showAddress} 
                    onChange={(e) => setShowAddress(e.target.checked)}
                    className="block"
                  >
                    <span className="font-medium">Address</span>
                  </Checkbox>
                  <Checkbox 
                    checked={showQrCode} 
                    onChange={(e) => setShowQrCode(e.target.checked)}
                    className="block"
                  >
                    <span className="font-medium">QR Code</span>
                  </Checkbox>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="lg:col-span-7">
          <Card className="shadow-lg border border-gray-200 overflow-hidden">
            <div className="mb-6 flex justify-between items-center">
              <Title level={4} className="mb-0">Signature Preview</Title>
              <div>
                <Button 
                  type="default"
                  onClick={() => setPreviewEmailModal(true)}
                  icon={<QuestionCircleOutlined />}
                  className="mr-2"
                >
                  How to use
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleSendToEmail}
                  icon={<MailOutlined />}
                  loading={emailSent}
                  className="bg-blue-500 hover:bg-blue-600 mr-2"
                >
                  Email to me
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleCopyHtml}
                  icon={<CopyOutlined />}
                  className={`${copySuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                  {copySuccess ? 'Copied!' : 'Copy HTML'}
                </Button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 bg-white mb-6">
              <div 
                className="email-signature-preview"
                dangerouslySetInnerHTML={{ __html: htmlSignature }}
              />
            </div>
            
            <Alert
              message="Installation Instructions"
              description={
                <div>
                  <p>To add this signature to your email client:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Click the <strong>Copy HTML</strong> button above</li>
                    <li>Open your email client settings (Gmail, Outlook, etc.)</li>
                    <li>Navigate to the signature section</li>
                    <li>Paste the copied HTML into your signature field</li>
                    <li>Save your changes</li>
                  </ol>
                  <p className="mt-2">Need help? Click the "How to use" button for detailed instructions for different email clients.</p>
                </div>
              }
              type="info"
              showIcon
            />
          </Card>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.back()}
        >
          Back to Profile
        </Button>
        <Button 
          type="primary" 
          onClick={() => router.push(`/companyAdmin/tags/${tagId}/virtual-background`)}
        >
          Create Virtual Background <ArrowLeftOutlined style={{ transform: 'rotate(180deg)' }} />
        </Button>
      </div>

      {/* How to use modal */}
      <Modal
        title="How to Add Your Signature to Email Clients"
        open={previewEmailModal}
        onCancel={() => setPreviewEmailModal(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setPreviewEmailModal(false)}>
            Got it
          </Button>
        ]}
        width={700}
      >
        <div className="space-y-6">
          <div>
            <Title level={5}>Gmail</Title>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Click on the gear icon in the top right corner, then select "See all settings"</li>
              <li>Scroll down to the "Signature" section</li>
              <li>Create a new signature or select an existing one</li>
              <li>Paste your copied HTML into the signature editor</li>
              <li>Scroll down and click "Save Changes"</li>
            </ol>
          </div>
          
          <div>
            <Title level={5}>Outlook Web</Title>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Click on the gear icon in the top right corner, then select "View all Outlook settings"</li>
              <li>Go to Mail → Compose and reply</li>
              <li>Scroll down to "Email signature"</li>
              <li>Paste your copied HTML into the signature editor</li>
              <li>Click "Save" at the bottom of the page</li>
            </ol>
          </div>
          
          <div>
            <Title level={5}>Outlook Desktop</Title>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Click on "File" → "Options" → "Mail"</li>
              <li>Click on the "Signatures..." button</li>
              <li>Create a new signature or edit an existing one</li>
              <li>Paste your copied HTML into the signature editor</li>
              <li>Click "OK" to save changes</li>
            </ol>
          </div>
          
          <div>
            <Title level={5}>Apple Mail</Title>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Go to Mail → Preferences → Signatures</li>
              <li>Select your email account and click the + button to add a new signature</li>
              <li>Name your signature</li>
              <li>Paste your copied HTML into the signature field</li>
              <li>Close the preferences window to save</li>
            </ol>
          </div>
          
          <Alert 
            message="Need more help?" 
            description="If you're having trouble adding your signature, try sending it to your email using the 'Email to me' button, or contact our support team for assistance."
            type="info"
            showIcon
            className="mt-4"
          />
        </div>
      </Modal>
    </div>
  );
};

export default EmailSignaturePage;

const styleTagId = 'email-signature-page-styles';
if (typeof document !== 'undefined' && !document.getElementById(styleTagId)) {
  const style = document.createElement('style');
  style.id = styleTagId;
  style.innerHTML = `
    .avatar-uploader .ant-upload {
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .ant-upload-select-picture-card:hover {
      border-color: #1890ff;
    }
    
    .email-signature-preview {
      min-height: 150px;
    }
  `;
  document.head.appendChild(style);
}