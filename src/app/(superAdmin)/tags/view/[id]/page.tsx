'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, Typography, Divider, Button, Spin, Avatar, Row, Col, List, Descriptions, Tag as AntdTag, notification, QRCode } from 'antd';
import { ArrowLeftOutlined, EditOutlined, MailOutlined, PhoneOutlined, GlobalOutlined, EnvironmentOutlined, QrcodeOutlined, DownloadOutlined, ShareAltOutlined } from '@ant-design/icons';
import Link from 'next/link';
import useTags from '@/hooks/useTags';
import { useTagsContext } from '@/context/tags/TagsContext';

const { Title, Text } = Typography;

const TagView = () => {
  const params = useParams();
  const router = useRouter();
  const tagId = params.id as string;
  const { fetchTagById, isLoading } = useTags();
  const [tag, setTag] = useState<any>(null);
  const [qrVisible, setQrVisible] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  // Use the tags context
  const { currentTag, getFromCache, addToCache, setCurrentTag } = useTagsContext();


  useEffect(() => {
    const loadTag = async () => {
      // 1. First check if the tag is the current one in context
      if (currentTag && currentTag.id.toString() === tagId.toString()) {
        setTag(currentTag);
        setLocalLoading(false);
        return;
      }

      // 2. If not current, check if it's in the cache
      const cachedTag = getFromCache(tagId);
      if (cachedTag) {
        setTag(cachedTag);
        setCurrentTag(cachedTag); // Update current tag in context
        setLocalLoading(false);
        return;
      }

      // 3. If not in context or cache, fetch from API
      if (tagId) {
        const result = await fetchTagById(tagId);
        if (result && !result.error) {
          setTag(result);
          setCurrentTag(result); // Set as current in context
          addToCache(result);    // Add to cache for future use
        } else {
          notification.error({
            message: 'Failed to Load Contact',
            description: result?.error || 'Could not load the contact information.'
          });
          router.push('/tags');
        }
        setLocalLoading(false);
      }
    };

    loadTag();
  }, [tagId, currentTag, getFromCache, addToCache, setCurrentTag, fetchTagById, router]);

  const handleEditClick = () => {
    // No need to pass data in URL since it's in context
    router.push(`/tags/edit/${tagId}`);
  };

  // Function to toggle QR code visibility
  const toggleQrCode = () => {
    setQrVisible(!qrVisible);
  };

  // Function to download QR code
  const downloadQrCode = () => {
    notification.success({
      message: 'QR Code Downloaded',
      description: 'Contact QR code has been saved to your downloads folder.'
    });
    // Implement actual download logic here
  };

  // Function to share contact
  const shareContact = () => {
    const shareData = {
      title: `${tag?.tagInfo.fname} ${tag?.tagInfo.lname}`,
      text: `Contact information for ${tag?.tagInfo.fname} ${tag?.tagInfo.lname}`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support sharing
      notification.info({
        message: 'Share Contact',
        description: 'Copy this link to share: ' + window.location.href
      });
    }
  };

  if (isLoading || localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spin size="large" tip="Loading contact information..." />
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="text-center py-10">
        <Title level={4}>Contact not found</Title>
        <Link href="/tags">
          <Button type="primary" icon={<ArrowLeftOutlined />} className="mt-4">
            Back to Contacts
          </Button>
        </Link>
      </div>
    );
  }

  // Extract tag information
  const { tagInfo } = tag;
  const fullName = `${tagInfo.fname} ${tagInfo.lname}`;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/tags">
            <Button icon={<ArrowLeftOutlined />} className="mr-3">
              Back
            </Button>
          </Link>
          <Title level={3} className="m-0">Contact Details</Title>
        </div>
        <div className="flex space-x-2">
          <Button
            icon={<QrcodeOutlined />}
            onClick={toggleQrCode}
            type={qrVisible ? "primary" : "default"}
          >
            QR Code
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEditClick}
          >
            Edit
          </Button>
        </div>
      </div>

      <Row gutter={24}>
        {/* Main contact info */}
        <Col xs={24} md={qrVisible ? 16 : 24}>
          <Card className="shadow-md rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center mb-6">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <Avatar
                  src={tagInfo.avatar}
                  size={100}
                  className="bg-blue-500"
                >
                  {!tagInfo.avatar && (tagInfo.fname.charAt(0) + tagInfo.lname.charAt(0)).toUpperCase()}
                </Avatar>
              </div>
              <div>
                <Title level={2} className="mb-1">{fullName}</Title>
                <Text className="text-lg text-gray-600 block">{tagInfo.position || 'No Position'}</Text>
                <Text className="text-md text-gray-500 block">{tagInfo.company || 'No Company'}</Text>
              </div>
            </div>

            <Divider />

            <Descriptions
              title="Contact Information"
              bordered
              column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
              className="mb-6"
            >
              {tagInfo.emails && tagInfo.emails.length > 0 && (
                <Descriptions.Item label="Email" span={2}>
                  <List
                    dataSource={tagInfo.emails}
                    renderItem={(email: any) => (
                      <List.Item className="pl-0 py-1 border-0">
                        <div className="flex items-center">
                          <MailOutlined className="mr-2 text-blue-500" />
                          <div className="text-blue-500 hover:underline">
                            {email.value}
                          </div>
                          <AntdTag className="ml-2" color="blue">{email.type}</AntdTag>
                        </div>
                      </List.Item>
                    )}
                  />
                </Descriptions.Item>
              )}

              {tagInfo.phones && tagInfo.phones.length > 0 && (
                <Descriptions.Item label="Phone" span={2}>
                  <List
                    dataSource={tagInfo.phones}
                    renderItem={(phone: any) => (
                      <List.Item className="pl-0 py-1 border-0">
                        <div className="flex items-center">
                          <PhoneOutlined className="mr-2 text-green-500" />
                          <div className="text-green-500 hover:underline">
                            {phone.value}
                          </div>
                          <AntdTag className="ml-2" color="green">{phone.type}</AntdTag>
                        </div>
                      </List.Item>
                    )}
                  />
                </Descriptions.Item>
              )}

              {tagInfo.websites && tagInfo.websites.length > 0 && (
                <Descriptions.Item label="Websites" span={2}>
                  <List
                    dataSource={tagInfo.websites}
                    renderItem={(website: any) => (
                      <List.Item className="pl-0 py-1 border-0">
                        <div className="flex items-center">
                          <GlobalOutlined className="mr-2 text-purple-500" />
                          <div  rel="noopener noreferrer" className="text-purple-500 hover:underline">
                            {website.value}
                          </div>
                          <AntdTag className="ml-2" color="purple">{website.type}</AntdTag>
                        </div>
                      </List.Item>
                    )}
                  />
                </Descriptions.Item>
              )}

              {tagInfo.addresses && tagInfo.addresses.length > 0 && (
                <Descriptions.Item label="Address" span={2}>
                  <List
                    dataSource={tagInfo.addresses}
                    renderItem={(address: any) => (
                      <List.Item className="pl-0 py-1 border-0">
                        <div className="flex items-start">
                          <EnvironmentOutlined className="mr-2 mt-1 text-red-500" />
                          <div>
                            <div className="text-gray-700">{address.value}</div>
                            <AntdTag className="mt-1" color="red">{address.type}</AntdTag>
                             <a
                              href={`https://maps.google.com/?q=${encodeURIComponent(address.value)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline block mt-1"
                            >
                              View on Google Maps
                            </a>
                          </div>
                        </div>
                      </List.Item>
                    )}
                  />
                </Descriptions.Item>
              )}

              {tagInfo.notes && (
                <Descriptions.Item label="Notes" span={2}>
                  <div className="whitespace-pre-wrap text-gray-700">{tagInfo.notes}</div>
                </Descriptions.Item>
              )}
            </Descriptions>

            <div className="flex justify-end space-x-2 mt-6">
              <Button icon={<ShareAltOutlined />} onClick={shareContact}>
                Share Contact
              </Button>
              <Button icon={<DownloadOutlined />} type="primary">
                Save vCard
              </Button>
            </div>
          </Card>
        </Col>

        {/* QR Code */}
        {qrVisible && (
          <Col xs={24} md={8}>
            <Card className="shadow-md rounded-lg text-center">
              <Title level={4}>Contact QR Code</Title>
              <div className="p-4 bg-white rounded-lg inline-block mx-auto my-4">
                <QRCode
                  value={`https://bizcotap.com/tags/view/${tag.tuid}`}
                  size={200}
                  bordered={false}
                />
              </div>
              <div className="mt-4">
                <Text className="text-gray-500 block mb-4">
                  Scan this QR code to save contact information.
                </Text>
                <Button
                  icon={<DownloadOutlined />}
                  type="primary"
                  onClick={downloadQrCode}
                  block
                >
                  Download QR Code
                </Button>
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default TagView;
