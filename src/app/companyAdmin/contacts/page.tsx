'use client';

import React, { useState, useEffect } from "react";
import { Table, Button, Input, Typography, message, Tooltip, Empty, Alert, Avatar, Card, Badge } from 'antd';
import {
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  MailOutlined,
  LoginOutlined,
  PlusOutlined,
  ReloadOutlined,
  PhoneOutlined,
  CommentOutlined,
  UserOutlined,
  BankOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Tag } from '@/services/tagsService';
import useTags from '@/hooks/useTags';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useTagsContext } from '@/context/tags/TagsContext';

const { Title, Text } = Typography;

// Define interfaces based on the actual data structure
interface TagInfo {
  role: string;
  fname: string;
  lname: string;
  title?: string;
  company?: string | null;
  position?: string;
  avatar?: string | null;
  // Add other properties as needed
}

interface TagUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

interface TagData {
  id: number;
  tuid: string;
  companyId: number | null;
  tagInfo: TagInfo;
  isActive: boolean;
  hasContact: boolean;
  createdAt: string;
  updatedAt: string;
  user: TagUser;
  company: any | null;
}

interface FormConfigData {
  id: number;
  formTitle: string;
  nameField: string | null;
  emailField: string | null;
  phoneField: string | null;
  companyField: string | null;
  messageField: string | null;
  submitButtonText: string;
  thankYouMessage: string;
  hasExchanged: boolean;
  tag: TagData;
  // Other properties
}

interface ContactsData {
  formConfigs: FormConfigData[];
  total: number;
  page: number;
  limit: number;
}

export default function ContactsTable() {
  const [searchText, setSearchText] = useState<string>('');
  const { companyContacts, fetchCompanyContacts, updateFormConfig, isLoading, error } = useTags();
  const router = useRouter();
  const { setCurrentTag, addToCache } = useTagsContext();

  // Extract the formConfigs array from companyContacts
  const formConfigs = companyContacts && 
    typeof companyContacts === 'object' && 
    'formConfigs' in companyContacts && 
    Array.isArray(companyContacts.formConfigs) 
      ? companyContacts.formConfigs 
      : [];

  // For debugging
  useEffect(() => {
    console.log("companyContacts:", companyContacts);
    console.log("formConfigs:", formConfigs);
  }, [companyContacts]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const getInitials = (firstName: string, lastName: string): string => {
    return (
      (firstName ? firstName.charAt(0) : '') +
      (lastName ? lastName.charAt(0) : '')
    ).toUpperCase();
  };

  // const handleView = (formConfig: FormConfigData) => {
  //   if (formConfig.tag) {
  //     setCurrentTag(formConfig.tag);
  //     addToCache(formConfig.tag);
  //     router.push(`https://link.bizcotap.com/profile/${formConfig.tag.tuid}`);
  //   }
  // };

  const handleMarkAsExchanged = async (formConfig: FormConfigData) => {
    try {
      const result = await updateFormConfig(formConfig.id, { hasExchanged: true });
      if (result.success) {
        message.success('Contact marked as exchanged');
        fetchCompanyContacts(); // Refresh the list to ensure the UI is updated
      } else {
        message.error(result.error || 'Failed to update contact status');
      }
    } catch (err) {
      message.error('Failed to update contact status');
      console.error(err);
    }
  };
  const refreshData = () => {
    fetchCompanyContacts();
    message.success('Contact list refreshed');
  };

  const columns: ColumnsType<FormConfigData> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      className: 'text-center',
      render: (_, __, index) => (
        <div className="text-center text-gray-600">{index + 1}</div>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      width: '80px',
      className: 'text-center',
      render: (_, record) => (
        <Avatar
          src={record.tag?.tagInfo?.avatar}
          size={50}
          className="bg-blue-500 flex-shrink-0 mx-auto"
        >
          {!record.tag?.tagInfo?.avatar && record.tag?.tagInfo && 
            getInitials(record.tag.tagInfo.fname || '', record.tag.tagInfo.lname || '')}
        </Avatar>
      ),
    },
    {
      title: 'Name',
      key: 'name',
      className: 'text-left',
      render: (_, record) => (
        <div>
          <div className="font-medium text-gray-900">
            {record.nameField || 
              (record.tag?.tagInfo ? 
                `${record.tag.tagInfo.fname || ''} ${record.tag.tagInfo.lname || ''}` : 
                'Unknown')}
          </div>
          {record.tag?.tagInfo?.position && (
            <div className="text-sm text-gray-500">
              {record.tag.tagInfo.position}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Contact Information',
      key: 'contactInfo',
      className: 'text-left',
      render: (_, record) => (
        <div className="space-y-1">
          {record.emailField && (
            <div className="flex items-center">
              <MailOutlined className="mr-2 text-green-500" /> 
              <Text>{record.emailField}</Text>
            </div>
          )}
          {record.phoneField && (
            <div className="flex items-center">
              <PhoneOutlined className="mr-2 text-purple-500" /> 
              <Text>{record.phoneField}</Text>
            </div>
          )}
          {(record.companyField || record.tag?.tagInfo?.company) && (
            <div className="flex items-center">
              <BankOutlined className="mr-2 text-orange-500" /> 
              <Text>{record.companyField || record.tag?.tagInfo?.company}</Text>
            </div>
          )}
          {record.messageField && record.messageField !== "value" && (
            <div className="flex items-center">
              <CommentOutlined className="mr-2 text-cyan-500" /> 
              <Text>{record.messageField}</Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: '100px',
      className: 'text-center',
      render: (_, record) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          record.hasExchanged 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {record.hasExchanged ? 'Exchanged' : 'Pending'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'text-center',
      width: '120px',
      render: (_, record) => (
        <div className="flex justify-center space-x-2">
          <Button
            type="primary"
            size="middle"
            icon={<EyeOutlined />}
            // onClick={() => handleView(record)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          />
          <Button
            type={record.hasExchanged ? "default" : "primary"}
            size="middle"
            icon={<EditOutlined />}
            onClick={() => handleMarkAsExchanged(record)}
            disabled={record.hasExchanged}
            className={record.hasExchanged ? 
              "bg-gray-100 hover:bg-gray-200 text-gray-600" : 
              "bg-green-500 hover:bg-green-600 text-white"}
          >
            {record.hasExchanged ? 'Exchanged' : 'Exchange'}
          </Button>
        </div>
      ),
    },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Contacts data...</p>
        </div>
      </div>
    );
  }

  const isAuthError = error && error.includes('Authentication');

  if (isAuthError) {
    return (
      <Card className="shadow-md rounded-lg overflow-hidden">
        <Alert
          message="Authentication Required"
          description="You need to log in to view contact data. Please log in and try again."
          type="warning"
          showIcon
          action={
            <Button type="primary" icon={<LoginOutlined />} onClick={() => {
              window.location.href = '/l'; 
            }}>
              Log In
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Title level={2} className="m-0 text-2xl font-bold">Company Contacts</Title>

        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Input
              placeholder="Search Contacts..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              className="rounded-lg w-full md:w-64"
              size="large"
            />
          </div>

          <Tooltip title="Refresh Data">
            <Button
              icon={<ReloadOutlined />}
              onClick={refreshData}
              size="large"
            />
          </Tooltip>
        </div>
      </div>

      <Card className="shadow-md rounded-lg overflow-hidden">
        {formConfigs.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <p className="text-lg font-medium mb-2">No Contact Form Submissions found</p>
                <p className="text-gray-500 mb-4">Contact forms are created automatically when users fill out forms on your tags</p>
                <Link href="/tags">
                  <Button type="primary" icon={<PlusOutlined />}>
                    View Your Tags
                  </Button>
                </Link>
              </div>
            }
            className="my-12"
          />
        ) : (
          <>
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <Text className="text-gray-600">
                  Showing <Badge count={formConfigs.length} showZero style={{ backgroundColor: '#1890ff' }} /> Contacts
                </Text>
              </div>
            </div>
            
            {/* Try/catch block to handle any rendering errors gracefully */}
            {(() => {
              try {
                return (
                  <Table
                    columns={columns}
                    dataSource={formConfigs}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      pageSizeOptions: ['10', '20', '50'],
                      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                      className: "px-4 py-3"
                    }}
                    className="w-full contact-table"
                    bordered={false}
                    expandable={{
                      expandedRowRender: (record) => (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          {record.tag?.tagInfo && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="font-semibold text-gray-700 mb-2">Tag Information</p>
                                <div className="space-y-1">
                                  <div>
                                    <span className="text-gray-600">Name:</span> {record.tag.tagInfo.fname} {record.tag.tagInfo.lname}
                                  </div>
                                  {record.tag.tagInfo.position && (
                                    <div>
                                      <span className="text-gray-600">Position:</span> {record.tag.tagInfo.position}
                                    </div>
                                  )}
                                  {record.tag.tagInfo.company && (
                                    <div>
                                      <span className="text-gray-600">Company:</span> {record.tag.tagInfo.company}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-700 mb-2">Form Details</p>
                                <div className="space-y-1">
                                  <div>
                                    <span className="text-gray-600">Form Title:</span> {record.formTitle || 'N/A'}
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Message:</span> {record.messageField === 'value' ? 'No message provided' : record.messageField || 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ),
                    }}
                  />
                );
              } catch (error) {
                console.error("Error rendering table:", error);
                // Fall back to a simple display of the form configs if table rendering fails
                return (
                  <div className="p-4">
                    <div className="space-y-4">
                      {formConfigs.map((config, index) => (
                        <div key={config.id} className="border p-4 rounded-lg">
                          <div className="font-medium">{config.nameField || 'Unknown'}</div>
                          {config.emailField && <div>Email: {config.emailField}</div>}
                          {config.phoneField && <div>Phone: {config.phoneField}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            })()}
          </>
        )}
      </Card>

      <style jsx global>{`
        .contact-table .ant-table-thead > tr > th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #374151;
        }

        .contact-table .ant-table-tbody > tr:hover > td {
          background-color: #f3f4f6;
        }

        .contact-table .ant-table-tbody > tr > td {
          padding: 16px;
        }

        .contact-table .ant-table-container {
          border-radius: 8px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}