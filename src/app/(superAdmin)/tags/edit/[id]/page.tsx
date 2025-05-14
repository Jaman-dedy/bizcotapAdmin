'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Form, Input, Button, Card, Typography, Divider, Spin, notification, Row, Col, Tabs, Avatar, Upload, Modal } from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import useTags from '@/hooks/useTags';
// import { transformTagData } from '@/utils/tagDataTransformer';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useTagsContext } from '@/context/tags/TagsContext';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { confirm } = Modal;

const TagEdit = () => {
  const params = useParams();
  const router = useRouter();
  const tagId = params.id as string;
  const { fetchTagById, updateTag, isLoading } = useTags();
  const [form] = Form.useForm();
  const [tag, setTag] = useState<any>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [emailFields, setEmailFields] = useState<any[]>([]);
  const [phoneFields, setPhoneFields] = useState<any[]>([]);
  const [websiteFields, setWebsiteFields] = useState<any[]>([]);
  const [addressFields, setAddressFields] = useState<any[]>([]);
  const [saveLoading, setSaveLoading] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  // Use the tags context
  const { currentTag, getFromCache, addToCache, setCurrentTag } = useTagsContext();

  // Helper function to set up form with tag data
  const setupFormWithTag = (tagData: any) => {
    setTag(tagData);
    setAvatarUrl(tagData.tagInfo.avatar);

    // Prepare dynamic fields
    setEmailFields(tagData.tagInfo.emails?.map((email: any, index: number) => ({
      id: index,
      type: email.type,
      value: email.value
    })) || []);

    setPhoneFields(tagData.tagInfo.phones?.map((phone: any, index: number) => ({
      id: index,
      type: phone.type,
      value: phone.value
    })) || []);

    setWebsiteFields(tagData.tagInfo.websites?.map((website: any, index: number) => ({
      id: index,
      type: website.type,
      value: website.value
    })) || []);

    setAddressFields(tagData.tagInfo.addresses?.map((address: any, index: number) => ({
      id: index,
      type: address.type,
      value: address.value
    })) || []);

    // Set form values
    form.setFieldsValue({
      fname: tagData.tagInfo.fname,
      lname: tagData.tagInfo.lname,
      title: tagData.tagInfo.title,
      company: tagData.tagInfo.company,
      position: tagData.tagInfo.position,
      notes: tagData.tagInfo.notes,
    });
  };

  useEffect(() => {
    const loadTag = async () => {
      // 1. First check if the tag is the current one in context
      if (currentTag && currentTag.id.toString() === tagId.toString()) {
        setupFormWithTag(currentTag);
        setLocalLoading(false);
        return;
      }

      // 2. If not current, check if it's in the cache
      const cachedTag = getFromCache(tagId);
      if (cachedTag) {
        setupFormWithTag(cachedTag);
        setCurrentTag(cachedTag); // Update current tag in context
        setLocalLoading(false);
        return;
      }

      // 3. If not in context or cache, fetch from API
      if (tagId) {
        const result = await fetchTagById(tagId);
        if (result && !result.error) {
          setupFormWithTag(result);
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
  }, [tagId, currentTag, getFromCache, addToCache, setCurrentTag, fetchTagById, router, form]);

  // Handle avatar upload
  const handleAvatarChange: UploadProps['onChange'] = (info) => {
    if (info.file instanceof File) {
      setAvatar(info.file);
      // Create a preview URL
      const url = URL.createObjectURL(info.file);
      setAvatarUrl(url);
    }
  };

  // Handle avatar deletion
  const handleRemoveAvatar = () => {
    confirm({
      title: 'Are you sure you want to remove the profile picture?',
      icon: <ExclamationCircleOutlined />,
      content: 'This will delete the current profile picture.',
      onOk() {
        setAvatar(null);
        setAvatarUrl(null);
      },
      onCancel() {},
    });
  };

  // Add a new email field
  const addEmailField = () => {
    const newId = emailFields.length > 0 ? Math.max(...emailFields.map(f => f.id)) + 1 : 0;
    setEmailFields([...emailFields, { id: newId, type: 'WORK', value: '' }]);
  };

  // Add a new phone field
  const addPhoneField = () => {
    const newId = phoneFields.length > 0 ? Math.max(...phoneFields.map(f => f.id)) + 1 : 0;
    setPhoneFields([...phoneFields, { id: newId, type: 'WORK', value: '' }]);
  };

  // Add a new website field
  const addWebsiteField = () => {
    const newId = websiteFields.length > 0 ? Math.max(...websiteFields.map(f => f.id)) + 1 : 0;
    setWebsiteFields([...websiteFields, { id: newId, type: 'WORK', value: '' }]);
  };

  // Add a new address field
  const addAddressField = () => {
    const newId = addressFields.length > 0 ? Math.max(...addressFields.map(f => f.id)) + 1 : 0;
    setAddressFields([...addressFields, { id: newId, type: 'WORK', value: '' }]);
  };

  // Remove field by id
  const removeEmailField = (id: number) => {
    setEmailFields(emailFields.filter(field => field.id !== id));
  };

  const removePhoneField = (id: number) => {
    setPhoneFields(phoneFields.filter(field => field.id !== id));
  };

  const removeWebsiteField = (id: number) => {
    setWebsiteFields(websiteFields.filter(field => field.id !== id));
  };

  const removeAddressField = (id: number) => {
    setAddressFields(addressFields.filter(field => field.id !== id));
  };

  // Update field value
  const updateEmailField = (id: number, key: string, value: string) => {
    setEmailFields(emailFields.map(field =>
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  const updatePhoneField = (id: number, key: string, value: string) => {
    setPhoneFields(phoneFields.map(field =>
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  const updateWebsiteField = (id: number, key: string, value: string) => {
    setWebsiteFields(websiteFields.map(field =>
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  const updateAddressField = (id: number, key: string, value: string) => {
    setAddressFields(addressFields.map(field =>
      field.id === id ? { ...field, [key]: value } : field
    ));
  };

  // Handle form submission
  const onFinish = async (values: any) => {
    try {
      setSaveLoading(true);

      // Prepare tag data
      const tagData = {
        userId: tag.userId,
        companyId: tag.companyId,
        tagInfo: {
          dob: tag.tagInfo.dob,
          fname: values.fname,
          lname: values.lname,
          notes: values.notes,
          title: values.title || 'Mr',
          avatar: avatarUrl, // This will be overridden by file upload if present
          emails: emailFields.filter(f => f.value.trim() !== '').map(f => ({ type: f.type, value: f.value })),
          phones: phoneFields.filter(f => f.value.trim() !== '').map(f => ({ type: f.type, value: f.value })),
          company: values.company,
          position: values.position,
          websites: websiteFields.filter(f => f.value.trim() !== '').map(f => ({ type: f.type, value: f.value })),
          addresses: addressFields.filter(f => f.value.trim() !== '').map(f => ({ type: f.type, value: f.value })),
          eventType: tag.tagInfo.eventType || "default-premium"
        }
      };

      // Update the tag
      const result = await updateTag(tagId, tagData, avatar);

      if (result.success) {
        // Update context and cache if update was successful
        if (result.data) {
          setCurrentTag(result.data);
          addToCache(result.data);
        }

        notification.success({
          message: 'Contact Updated',
          description: 'Contact information has been updated successfully.'
        });
        router.push('/tags');
      } else {
        notification.error({
          message: 'Update Failed',
          description: result.error || 'Failed to update contact information.'
        });
      }
    } catch (error: any) {
      notification.error({
        message: 'Error',
        description: error.message || 'An unexpected error occurred.'
      });
    } finally {
      setSaveLoading(false);
    }
  };

  // For the loading state in the TagEdit component
  if (isLoading || localLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Spin size="large" />
          <div className="mt-3 text-gray-500">Loading contact information...</div>
        </div>
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

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link href="/tags">
            <Button icon={<ArrowLeftOutlined />} className="mr-3">
              Back
            </Button>
          </Link>
          <Title level={3} className="m-0">Edit Contact</Title>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={() => form.submit()}
          loading={saveLoading}
        >
          Save Changes
        </Button>
      </div>

      <Card className="shadow-md rounded-lg overflow-hidden mb-6">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            fname: tag.tagInfo.fname,
            lname: tag.tagInfo.lname,
            title: tag.tagInfo.title,
            company: tag.tagInfo.company,
            position: tag.tagInfo.position,
            notes: tag.tagInfo.notes,
          }}
        >
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            <div className="flex flex-col items-center">
              <Avatar
                src={avatarUrl}
                size={100}
                className="bg-blue-500 mb-3"
              >
                {!avatarUrl && (tag.tagInfo.fname.charAt(0) + tag.tagInfo.lname.charAt(0)).toUpperCase()}
              </Avatar>

              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleAvatarChange}
              >
                <Button icon={<UploadOutlined />}>Change Photo</Button>
              </Upload>

              {avatarUrl && (
                <Button
                  danger
                  type="link"
                  onClick={handleRemoveAvatar}
                  className="mt-2"
                >
                  Remove Photo
                </Button>
              )}
            </div>

            <div className="flex-grow">
              <Row gutter={16}>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="title"
                    label="Title"
                  >
                    <Input placeholder="Mr/Ms/Dr" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="fname"
                    label="First Name"
                    rules={[{ required: true, message: 'Please enter first name' }]}
                  >
                    <Input placeholder="First Name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="lname"
                    label="Last Name"
                    rules={[{ required: true, message: 'Please enter last name' }]}
                  >
                    <Input placeholder="Last Name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="company"
                    label="Company"
                  >
                    <Input placeholder="Company Name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="position"
                    label="Position"
                  >
                    <Input placeholder="Job Title" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>

          <Divider />

          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <MailOutlined />
                  Email{emailFields.length > 0 ? ` (${emailFields.length})` : ''}
                </span>
              }
              key="1"
            >
              {emailFields.map((field, index) => (
                <Row gutter={16} key={field.id} className="mb-3">
                  <Col xs={18}>
                    <Input
                      prefix={<MailOutlined className="text-gray-400" />}
                      placeholder="Email Address"
                      value={field.value}
                      onChange={(e) => updateEmailField(field.id, 'value', e.target.value)}
                    />
                  </Col>
                  <Col xs={6} className="flex items-center">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeEmailField(field.id)}
                    />
                  </Col>
                </Row>
              ))}

              <Button
                type="dashed"
                onClick={addEmailField}
                icon={<PlusOutlined />}
                className="w-full mt-3"
              >
                Add Email
              </Button>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <PhoneOutlined />
                  Phone{phoneFields.length > 0 ? ` (${phoneFields.length})` : ''}
                </span>
              }
              key="2"
            >
              {phoneFields.map((field, index) => (
                <Row gutter={16} key={field.id} className="mb-3">
                  <Col xs={18}>
                    <Input
                      prefix={<PhoneOutlined className="text-gray-400" />}
                      placeholder="Phone Number"
                      value={field.value}
                      onChange={(e) => updatePhoneField(field.id, 'value', e.target.value)}
                    />
                  </Col>
                  <Col xs={6} className="flex items-center">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removePhoneField(field.id)}
                    />
                  </Col>
                </Row>
              ))}

              <Button
                type="dashed"
                onClick={addPhoneField}
                icon={<PlusOutlined />}
                className="w-full mt-3"
              >
                Add Phone
              </Button>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <GlobalOutlined />
                  Website{websiteFields.length > 0 ? ` (${websiteFields.length})` : ''}
                </span>
              }
              key="3"
            >
              {websiteFields.map((field, index) => (
                <Row gutter={16} key={field.id} className="mb-3">
                  <Col xs={18}>
                    <Input
                      prefix={<GlobalOutlined className="text-gray-400" />}
                      placeholder="Website URL"
                      value={field.value}
                      onChange={(e) => updateWebsiteField(field.id, 'value', e.target.value)}
                    />
                  </Col>
                  <Col xs={6} className="flex items-center">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeWebsiteField(field.id)}
                    />
                  </Col>
                </Row>
              ))}

              <Button
                type="dashed"
                onClick={addWebsiteField}
                icon={<PlusOutlined />}
                className="w-full mt-3"
              >
                Add Website
              </Button>
            </TabPane>

            <TabPane
              tab={
                <span>
                  <EnvironmentOutlined />
                  Address{addressFields.length > 0 ? ` (${addressFields.length})` : ''}
                </span>
              }
              key="4"
            >
              {addressFields.map((field, index) => (
                <Row gutter={16} key={field.id} className="mb-3">
                  <Col xs={18}>
                    <TextArea
                      placeholder="Address"
                      value={field.value}
                      onChange={(e) => updateAddressField(field.id, 'value', e.target.value)}
                      autoSize={{ minRows: 2, maxRows: 4 }}
                    />
                  </Col>
                  <Col xs={6} className="flex items-center">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeAddressField(field.id)}
                    />
                  </Col>
                </Row>
              ))}

              <Button
                type="dashed"
                onClick={addAddressField}
                icon={<PlusOutlined />}
                className="w-full mt-3"
              >
                Add Address
              </Button>
            </TabPane>
          </Tabs>

          <Divider />

          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea
              placeholder="Notes or additional information"
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>

          <div className="flex justify-end mt-6">
            <Button
              type="default"
              className="mr-3"
              onClick={() => router.push('/tags')}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saveLoading}
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default TagEdit;
