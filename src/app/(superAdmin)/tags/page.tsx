'use client';

import React, { useState, useEffect } from "react";
import { Table, Button, Input, Typography, Dropdown, message, Tooltip, Empty, Alert, Avatar, Card } from 'antd';
import { 
  SearchOutlined, 
  MoreOutlined, 
  EditOutlined, 
  EyeOutlined, 
  MailOutlined, 
  LoginOutlined, 
  QrcodeOutlined,
  DownloadOutlined,
  PlusOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Tag, Email } from '@/services/tagsService';
import useTags from '@/hooks/useTags';
import Link from "next/link";

export default function TagsTable() {
  const [searchText, setSearchText] = useState<string>('');
  const { tags, isLoading, error, fetchTags, deleteTag } = useTags();
  const { Title } = Typography;

  // Handle any error at component level
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // Get primary email
  const getPrimaryEmail = (emails: Email[]): string => {
    if (!emails || emails.length === 0) return 'N/A';
    return emails[0].value;
  };

  // Generate initials from name
  const getInitials = (firstName: string, lastName: string): string => {
    return (
      (firstName ? firstName.charAt(0) : '') + 
      (lastName ? lastName.charAt(0) : '')
    ).toUpperCase();
  };

  // Filter tags based on search text
  const filteredTags = tags.filter(tag => {
    const searchLower = searchText.toLowerCase();
    const fname = tag.tagInfo.fname?.toLowerCase() || '';
    const lname = tag.tagInfo.lname?.toLowerCase() || '';
    const emails = tag.tagInfo.emails?.map(e => e.value.toLowerCase()) || [];
    const company = tag.tagInfo.company?.toLowerCase() || '';
    
    return fname.includes(searchLower) || 
           lname.includes(searchLower) || 
           emails.some(email => email.includes(searchLower)) ||
           company.includes(searchLower);
  });

  const handleView = (tag: Tag) => {
    message.info(`Viewing details for ${tag.tagInfo.fname} ${tag.tagInfo.lname}`);
    // Implement view logic or navigation
  };

  const handleEdit = (tag: Tag) => {
    message.info(`Editing tag for ${tag.tagInfo.fname} ${tag.tagInfo.lname}`);
    // Implement logic to navigate to the edit tag page or open an edit modal
    window.location.href = `/tags/edit/${tag.id}`;
    // Implement edit logic
  };
  
  const handleDelete = async (id: number) => {
    const result = await deleteTag(id);
    if (result.success) {
      message.success('Contact deleted successfully');
    } else {
      message.error(result.error || 'Failed to delete contact');
    }
  };

  const handleDownloadOfflineQR = (tag: Tag) => {
    message.success(`Downloading offline QR code for ${tag.tagInfo.fname} ${tag.tagInfo.lname}`);
    // Implement QR code download logic
  };

  const handleDownloadOnlineQR = (tag: Tag) => {
    message.success(`Downloading online QR code for ${tag.tagInfo.fname} ${tag.tagInfo.lname}`);
    // Implement QR code download logic
  };

  // Define columns for the table
  const columns: ColumnsType<Tag> = [
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
        title: 'photo',
        key: 'photo',
        className: 'text-left',
        render: (_, record) => (
          <div className="flex items-center space-x-3">
            <Avatar 
              src={record.tagInfo.avatar} 
              size={40}
              className="bg-brand-500 flex-shrink-0"
            >
              {!record.tagInfo.avatar && getInitials(record.tagInfo.fname, record.tagInfo.lname)}
            </Avatar>
          </div>
        ),
      },
    
    {
      title: 'Name',
      key: 'name',
      className: 'text-left',
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {record.tagInfo.fname} {record.tagInfo.lname}
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => {
        const nameA = `${a.tagInfo.fname} ${a.tagInfo.lname}`;
        const nameB = `${b.tagInfo.fname} ${b.tagInfo.lname}`;
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: 'Email',
      key: 'email',
      className: 'text-left',
      render: (_, record) => {
        const email = getPrimaryEmail(record.tagInfo.emails);
        return (
          <div className="flex items-center">
            <MailOutlined className="mr-2 text-gray-500" />
            <span className="text-gray-700 dark:text-gray-300">{email}</span>
          </div>
        );
      },
      sorter: (a, b) => {
        const emailA = getPrimaryEmail(a.tagInfo.emails);
        const emailB = getPrimaryEmail(b.tagInfo.emails);
        return emailA.localeCompare(emailB);
      },
    },
    {
      title: 'Company',
      key: 'company',
      className: 'text-left',
      render: (_, record) => (
        <div className="text-gray-700 dark:text-gray-300">
          {record.tagInfo.company || 'N/A'}
        </div>
      ),
      sorter: (a, b) => (a.tagInfo.company || '').localeCompare(b.tagInfo.company || ''),
    },
    {
      title: 'Options',
      key: 'actions',
      className: 'text-center',
      render: (_, record) => (
        <div className="flex justify-center space-x-2">
          <Button 
            type="primary"
            size="small"
            icon={<EyeOutlined />} 
            onClick={() => handleView(record)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            View
          </Button>
          <Button 
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="border-gray-300 hover:border-gray-400 hover:bg-gray-100"
          >
            Edit
          </Button>
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  label: 'Download Offline QR',
                  icon: <QrcodeOutlined />,
                  onClick: () => handleDownloadOfflineQR(record),
                },
                {
                  key: '2',
                  label: 'Download Online QR',
                  icon: <QrcodeOutlined />,
                  onClick: () => handleDownloadOnlineQR(record),
                },
                {
                  type: 'divider',
                },
                {
                  key: '3',
                  label: 'Delete',
                  danger: true,
                  onClick: () => handleDelete(record.id),
                },
              ],
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button 
              type="default"
              size="small"
              icon={<MoreOutlined />} 
              className="border-gray-300 hover:border-gray-400 hover:bg-gray-100"
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-brand-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading contacts data...</p>
        </div>
      </div>
    );
  }

  // Check if there's an auth error by examining the error message
  const isAuthError = error && error.includes('Authentication');

  // Show authentication alert if error is auth-related
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
              // Redirect to login page or open login modal
              window.location.href = '/login'; // Adjust to your login path
            }}>
              Log In
            </Button>
          }
        />
      </Card>
    );
  }
  const handleAddNewTag = () => {
    message.info('Adding new tag');
    // Implement logic to open add tag form or modal
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <Title level={2} className="m-0 text-2xl font-bold">All Tags</Title>
        <div className="flex items-center gap-2 w-full md:w-auto">
            
          <Input
            placeholder="Search contacts..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="rounded-lg"
          /> 
          <Link 
            href={"tags/new"}
            className="bg-blue-500 hover:bg-blue-600 text-white">
               <Button 
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Create New Tag
          </Button>
          </Link>
        </div>
      </div>

      <Card className="shadow-md rounded-lg overflow-hidden">
        {tags.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No contacts found"
            className="my-12"
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredTags}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              className: "px-4 py-3"
            }}
            className="w-full"
            bordered={false}
            rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800"
          />
        )}
      </Card>
    </div>
  );
}