'use client';

import React, { useState, useEffect } from "react";
import { Table, Button, Input, Typography, Dropdown, message, Tooltip, Empty, Alert, Avatar, Card, Modal, Badge, Space } from 'antd';
import {
  SearchOutlined,
  MoreOutlined,
  EditOutlined,
  EyeOutlined,
  MailOutlined,
  LoginOutlined,
  QrcodeOutlined,
  PlusOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Tag, Email } from '@/services/tagsService';
import useTags from '@/hooks/useTags';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useTagsContext } from '@/context/tags/TagsContext';

const { Title, Text } = Typography;
const { confirm } = Modal;

export default function TagsTable() {
  const [searchText, setSearchText] = useState<string>('');
  const [sortedInfo, setSortedInfo] = useState<any>({});
  const [filteredInfo, setFilteredInfo] = useState<any>({});
  const { tags, isLoading, error, fetchTags, deleteTag } = useTags();
  const router = useRouter();

  // Use the tags context
  const { setCurrentTag, addToCache } = useTagsContext();

  // Handle any error at component level
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // Generate initials from name
  const getInitials = (firstName: string, lastName: string): string => {
    return (
      (firstName ? firstName.charAt(0) : '') +
      (lastName ? lastName.charAt(0) : '')
    ).toUpperCase();
  };

  // Handle table change (sorting, filtering)
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  // Reset filters and sorters
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
    setSearchText('');
  };

  // Filter tags based on search text and filters
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

  // Updated to store tag in context before navigation
  const handleView = (tag: Tag) => {
    setCurrentTag(tag);  // Store the current tag in context
    addToCache(tag);     // Add to the cache for future reference
    router.push(`https://link.bizcotap.com/profile/6829856056316e89705d98`);
  };

  // Updated to store tag in context before navigation
  const handleEdit = (tag: Tag) => {
    setCurrentTag(tag);  // Store the current tag in context
    addToCache(tag);     // Add to the cache for future reference
    router.push(`/tags/edit/${tag.id}`);
  };

  const handleDelete = (tag: Tag) => {
    confirm({
      title: `Are you sure you want to delete ${tag.tagInfo.fname} ${tag.tagInfo.lname}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      async onOk() {
        const result = await deleteTag(tag.id);
        if (result.success) {
          message.success(`${tag.tagInfo.fname} ${tag.tagInfo.lname} has been deleted successfully.`);
        } else {
          message.error(result.error || 'Failed to delete contact');
        }
      }
    });
  };

  const handleDownloadOfflineQR = (tag: Tag) => {
    message.success(`Downloading offline QR code for ${tag.tagInfo.fname} ${tag.tagInfo.lname}`);
    // Implement QR code download logic
  };

  const handleDownloadOnlineQR = (tag: Tag) => {
    message.success(`Downloading online QR code for ${tag.tagInfo.fname} ${tag.tagInfo.lname}`);
    // Implement QR code download logic
  };

  // Refresh data
  const refreshData = () => {
    fetchTags();
    message.success('Contact list refreshed');
  };

  const companyFilters = Array.from(new Set(tags.map(tag => tag.tagInfo.company)))
    .filter(Boolean)
    .map(company => ({ text: company, value: company })) as { text: string; value: string }[];

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
      title: 'Profile',
      key: 'profile',
      width: '80px',
      className: 'text-center',
      render: (_, record) => (
        <Avatar
          src={record.tagInfo.avatar}
          size={50}
          className="bg-blue-500 flex-shrink-0 mx-auto"
        >
          {!record.tagInfo.avatar && getInitials(record.tagInfo.fname, record.tagInfo.lname)}
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
            {record.tagInfo.fname} {record.tagInfo.lname}
          </div>
          {record.tagInfo.position && (
            <div className="text-sm text-gray-500">
              {record.tagInfo.position}
            </div>
          )}
        </div>
      ),
      sorter: (a, b) => {
        const nameA = `${a.tagInfo.fname} ${a.tagInfo.lname}`;
        const nameB = `${b.tagInfo.fname} ${b.tagInfo.lname}`;
        return nameA.localeCompare(nameB);
      },
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
    },
    {
      title: 'Company',
      key: 'company',
      className: 'text-left',
      width: '30%',
      render: (_, record) => (
        <div className="text-gray-700 font-medium">
          {record.tagInfo.company || 'N/A'}
        </div>
      ),
      sorter: (a, b) => (a.tagInfo.company || '').localeCompare(b.tagInfo.company || ''),
      sortOrder: sortedInfo.columnKey === 'company' && sortedInfo.order,
      filters: companyFilters,
      filteredValue: filteredInfo.company || null,
      onFilter: (value, record) => record.tagInfo.company === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      className: 'text-center',
      width: '20%',
      render: (_, record) => (
        <div className="flex justify-center space-x-2">
          <Button
            type="primary"
            size="middle"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          />
          <Button
            type="default"
            size="middle"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="border-gray-300 hover:border-gray-400 hover:bg-gray-100"
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  label: 'View Details',
                  icon: <EyeOutlined />,
                  onClick: () => handleView(record),
                },
                {
                  key: '2',
                  label: 'Edit Contact',
                  icon: <EditOutlined />,
                  onClick: () => handleEdit(record),
                },
                {
                  type: 'divider',
                },
                {
                  key: '3',
                  label: 'Download Offline QR',
                  icon: <QrcodeOutlined />,
                  onClick: () => handleDownloadOfflineQR(record),
                },
                {
                  key: '4',
                  label: 'Download Online QR',
                  icon: <QrcodeOutlined />,
                  onClick: () => handleDownloadOnlineQR(record),
                },
                {
                  type: 'divider',
                },
                {
                  key: '5',
                  label: 'Delete',
                  danger: true,
                  icon: <DeleteOutlined />,
                  onClick: () => handleDelete(record),
                },
              ],
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="default"
              size="middle"
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
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contacts data...</p>
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
              window.location.href = '/'; // Adjust to your login path
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
        <Title level={2} className="m-0 text-2xl font-bold">Contacts & Digital Cards</Title>

        <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Input
              placeholder="Search contacts..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              className="rounded-lg w-full md:w-64"
              size="large"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Tooltip title="Refresh Data">
              <Button
                icon={<ReloadOutlined />}
                onClick={refreshData}
                size="large"
              />
            </Tooltip>

            <Tooltip title="Clear Filters">
              <Button
                icon={<FilterOutlined />}
                onClick={clearAll}
                size="large"
                type={filteredInfo.company || sortedInfo.columnKey ? "primary" : "default"}
              />
            </Tooltip>

            <Link href="/tags/new">
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Create New
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Card className="shadow-md rounded-lg overflow-hidden">
        {tags.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <p className="text-lg font-medium mb-2">No contacts found</p>
                <p className="text-gray-500 mb-4">Create your first contact to get started</p>
                <Link href="/tags/new">
                  <Button type="primary" icon={<PlusOutlined />}>
                    Create New Contact
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
                <div>
                  <Text className="text-gray-600">
                    Showing <Badge count={filteredTags.length} showZero style={{ backgroundColor: '#1890ff' }} /> of {tags.length} contacts
                  </Text>
                  {(Object.keys(filteredInfo).length > 0 || searchText) && (
                    <Button
                      type="link"
                      size="small"
                      onClick={clearAll}
                      className="text-blue-500"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Text className="text-gray-600 mr-2">Sort by:</Text>
                  <Button
                    size="small"
                    icon={<SortAscendingOutlined />}
                    type={sortedInfo.order === 'ascend' ? 'primary' : 'default'}
                    onClick={() => setSortedInfo({ columnKey: 'contact', order: 'ascend' })}
                  >
                    Name
                  </Button>
                  <Button
                    size="small"
                    icon={<SortDescendingOutlined />}
                    type={sortedInfo.order === 'descend' ? 'primary' : 'default'}
                    onClick={() => setSortedInfo({ columnKey: 'contact', order: 'descend' })}
                  >
                    Name
                  </Button>
                </div>
              </div>
            </div>
            <Table
              columns={columns}
              dataSource={filteredTags}
              rowKey="id"
              onChange={handleTableChange}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                className: "px-4 py-3"
              }}
              className="w-full contact-table"
              bordered={false}
              rowClassName="hover:bg-gray-50"
              showSorterTooltip={false}
            />
          </>
        )}
      </Card>

      {/* Custom styling for the table */}
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
