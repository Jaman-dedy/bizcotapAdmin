// components/dashboard/UsersPage.tsx
'use client'
import React, { useState, useMemo } from 'react';
import {
  Row, Col, Card, Table, Tag, Button, Input, Avatar,
  Typography, Dropdown, Switch, Tooltip, Badge,
  Space, Modal, Form, Select, Tabs, Statistic, Empty, Spin
} from 'antd';
import {
  UserOutlined, SearchOutlined, FilterOutlined,
  DownloadOutlined, PlusOutlined, EllipsisOutlined,
  EditOutlined, LockOutlined, MailOutlined, EyeOutlined,
  DeleteOutlined, CheckCircleOutlined, StopOutlined,
  TeamOutlined, UserSwitchOutlined, SafetyOutlined,
  IeOutlined, ReloadOutlined, SendOutlined
} from '@ant-design/icons';
import { HistoryOutlined, UnlockOutlined } from '@ant-design/icons';
import { UserDetailsModal } from './UserDetailsModal';
import type { TabsProps } from 'antd';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Define user role types and colors
type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'INDIVIDUAL';

const ROLE_COLORS: Record<UserRole, string> = {
  'SUPER_ADMIN': '#1890ff',
  'ADMIN': '#722ed1',
  'INDIVIDUAL': '#52c41a'
};

const ROLE_LABELS: Record<UserRole, string> = {
  'SUPER_ADMIN': 'Super Admin',
  'ADMIN': 'Admin',
  'INDIVIDUAL': 'Individual User'
};

// Dummy data
const DUMMY_USERS = [
  {
    id: 421,
    email: "shemap300@gmail.com",
    firstName: "Patrick",
    lastName: "K. SHEMA",
    phone: null,
    role: "INDIVIDUAL",
    isActive: true,
    createdAt: "2025-05-10T10:03:13.248Z",
    updatedAt: "2025-05-10T10:03:13.248Z",
    googleId: null,
    appleId: null,
    linkedinId: null,
    dataConsentVersion: null,
    dataConsentDate: null,
    marketingConsent: false,
    marketingConsentDate: null,
    lastPrivacyNoticeView: null,
    dataRetentionDate: null,
    passwordLastChanged: null,
    failedLoginAttempts: 0,
    lastFailedLogin: null,
    accountLocked: false,
    accountLockedUntil: null,
    mfaEnabled: false,
    mfaSecret: null,
    companyId: null,
    company: null
  },
  {
    id: 9,
    email: "alice.kayibanda@undp.org",
    firstName: "Alice",
    lastName: "Kayibanda",
    phone: null,
    role: "INDIVIDUAL",
    isActive: true,
    createdAt: "2025-05-10T10:03:13.261Z",
    updatedAt: "2025-05-10T10:03:13.261Z",
    googleId: null,
    appleId: null,
    linkedinId: null,
    dataConsentVersion: null,
    dataConsentDate: null,
    marketingConsent: false,
    marketingConsentDate: null,
    lastPrivacyNoticeView: null,
    dataRetentionDate: null,
    passwordLastChanged: null,
    failedLoginAttempts: 0,
    lastFailedLogin: null,
    accountLocked: false,
    accountLockedUntil: null,
    mfaEnabled: false,
    mfaSecret: null,
    companyId: null,
    company: null
  },
  {
    id: 1,
    email: "info@bizcotap.com",
    firstName: "Super",
    lastName: "Admin",
    phone: null,
    role: "SUPER_ADMIN",
    isActive: true,
    createdAt: "2025-05-10T10:03:13.236Z",
    updatedAt: "2025-05-10T13:28:14.384Z",
    googleId: null,
    appleId: null,
    linkedinId: null,
    dataConsentVersion: null,
    dataConsentDate: null,
    marketingConsent: false,
    marketingConsentDate: null,
    lastPrivacyNoticeView: null,
    dataRetentionDate: null,
    passwordLastChanged: null,
    failedLoginAttempts: 0,
    lastFailedLogin: null,
    accountLocked: false,
    accountLockedUntil: null,
    mfaEnabled: false,
    mfaSecret: null,
    companyId: null,
    company: null
  }
];

// Add synthetic data for better UI demonstration
const EXTENDED_USERS = [
  ...DUMMY_USERS,
  {
    id: 55,
    email: "john.doe@example.com",
    firstName: "John",
    lastName: "Doe",
    phone: "+1 555-123-4567",
    role: "ADMIN",
    isActive: true,
    createdAt: "2025-04-15T14:22:31.236Z",
    updatedAt: "2025-05-09T09:15:43.384Z",
    googleId: "google_123456",
    appleId: null,
    linkedinId: null,
    dataConsentVersion: "1.0",
    dataConsentDate: "2025-04-15T14:22:31.236Z",
    marketingConsent: true,
    marketingConsentDate: "2025-04-15T14:22:31.236Z",
    lastPrivacyNoticeView: "2025-05-01T10:12:54.723Z",
    dataRetentionDate: null,
    passwordLastChanged: "2025-05-01T10:12:54.723Z",
    failedLoginAttempts: 0,
    lastFailedLogin: null,
    accountLocked: false,
    accountLockedUntil: null,
    mfaEnabled: true,
    mfaSecret: "secret_hash",
    companyId: 12,
    company: { id: 12, name: "ABC Corporation" }
  },
  {
    id: 78,
    email: "emma.wilson@tech.co",
    firstName: "Emma",
    lastName: "Wilson",
    phone: "+44 7911 123456",
    role: "ADMIN",
    isActive: false,
    createdAt: "2025-03-22T08:45:19.471Z",
    updatedAt: "2025-05-08T11:32:07.145Z",
    googleId: null,
    appleId: "apple_789012",
    linkedinId: null,
    dataConsentVersion: "1.1",
    dataConsentDate: "2025-03-22T08:45:19.471Z",
    marketingConsent: false,
    marketingConsentDate: null,
    lastPrivacyNoticeView: "2025-03-22T08:45:19.471Z",
    dataRetentionDate: null,
    passwordLastChanged: "2025-04-18T15:47:23.912Z",
    failedLoginAttempts: 3,
    lastFailedLogin: "2025-05-08T11:32:07.145Z",
    accountLocked: true,
    accountLockedUntil: "2025-05-11T11:32:07.145Z",
    mfaEnabled: false,
    mfaSecret: null,
    companyId: 8,
    company: { id: 8, name: "Tech Solutions Ltd" }
  },
  {
    id: 126,
    email: "carlos.rodriguez@gmail.com",
    firstName: "Carlos",
    lastName: "Rodriguez",
    phone: "+34 612 345 678",
    role: "INDIVIDUAL",
    isActive: true,
    createdAt: "2025-01-10T16:22:45.127Z",
    updatedAt: "2025-05-07T19:14:02.384Z",
    googleId: null,
    appleId: null,
    linkedinId: "linkedin_345678",
    dataConsentVersion: "1.2",
    dataConsentDate: "2025-01-10T16:22:45.127Z",
    marketingConsent: true,
    marketingConsentDate: "2025-01-10T16:22:45.127Z",
    lastPrivacyNoticeView: "2025-04-12T08:33:17.845Z",
    dataRetentionDate: null,
    passwordLastChanged: "2025-03-25T12:08:11.639Z",
    failedLoginAttempts: 1,
    lastFailedLogin: "2025-05-07T19:12:47.211Z",
    accountLocked: false,
    accountLockedUntil: null,
    mfaEnabled: true,
    mfaSecret: "secret_hash",
    companyId: null,
    company: null
  }
];

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  googleId: string | null;
  appleId: string | null;
  linkedinId: string | null;
  dataConsentVersion: string | null;
  dataConsentDate: string | null;
  marketingConsent: boolean;
  marketingConsentDate: string | null;
  lastPrivacyNoticeView: string | null;
  dataRetentionDate: string | null;
  passwordLastChanged: string | null;
  failedLoginAttempts: number;
  lastFailedLogin: string | null;
  accountLocked: boolean;
  accountLockedUntil: string | null;
  mfaEnabled: boolean;
  mfaSecret: string | null;
  companyId: number | null;
  company: { id: number; name: string } | null;
}

const UsersPage: React.FC = () => {
  // States
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // For demo purposes, simulate loading
  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Generate user statistics
  const userStats = useMemo(() => {
    const stats = {
      total: EXTENDED_USERS.length,
      active: EXTENDED_USERS.filter(user => user.isActive).length,
      inactive: EXTENDED_USERS.filter(user => !user.isActive).length,
      admin: EXTENDED_USERS.filter(user => user.role === 'ADMIN' || user.role === 'SUPER_ADMIN').length,
      individual: EXTENDED_USERS.filter(user => user.role === 'INDIVIDUAL').length,
      withMfa: EXTENDED_USERS.filter(user => user.mfaEnabled).length,
      locked: EXTENDED_USERS.filter(user => user.accountLocked).length
    };
    return stats;
  }, []);

  // Filter users based on search term, role filter, and status filter
  const filteredUsers = useMemo(() => {
    return EXTENDED_USERS.filter(user => {
      // Search term filter
      const searchTermMatch =
        searchTerm === '' ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());

      // Role filter
      const roleMatch =
        roleFilter === 'ALL' ||
        user.role === roleFilter;

      // Status filter
      const statusMatch =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'inactive' && !user.isActive);

      // Tab filter
      const tabMatch =
        activeTab === 'all' ||
        (activeTab === 'active' && user.isActive) ||
        (activeTab === 'locked' && user.accountLocked) ||
        (activeTab === 'admin' && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) ||
        (activeTab === 'individual' && user.role === 'INDIVIDUAL');

      return searchTermMatch && roleMatch && statusMatch && tabMatch;
    });
  }, [searchTerm, roleFilter, statusFilter, activeTab]);

  // Handle opening user details
  const handleOpenUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  // Generate initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Generate random color for avatar based on user ID
  const getAvatarColor = (id: number) => {
    const colors = [
      '#1890ff', '#52c41a', '#722ed1', '#faad14', '#eb2f96',
      '#13c2c2', '#fa541c', '#a0d911', '#1890ff', '#2f54eb'
    ];
    return colors[id % colors.length];
  };

  // Handle user status change
  const handleStatusChange = (checked: boolean, user: User) => {
    // In a real app, this would call an API
    console.log(`Changed user ${user.id} status to ${checked ? 'active' : 'inactive'}`);
    // Then refetch data
    simulateLoading();
  };

  // Table columns
  const columns = [
    {
      title: 'User',
      dataIndex: 'firstName',
      key: 'name',
      render: (_: string, user: User) => (
        <div className="flex items-center">
          <Avatar
            size={40}
            style={{ backgroundColor: getAvatarColor(user.id) }}
            className="flex items-center justify-center text-white mr-3"
          >
            {getInitials(user.firstName, user.lastName)}
          </Avatar>
          <div>
            <div
              className="font-medium text-gray-800 hover:text-blue-500 cursor-pointer transition-colors"
              onClick={() => handleOpenUserDetails(user)}
            >
              {user.firstName} {user.lastName}
            </div>
            <div className="text-xs text-gray-500 flex items-center">
              <MailOutlined className="mr-1" /> {user.email}
            </div>
          </div>
        </div>
      ),
      sorter: (a: User, b: User) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole) => (
        <Tag
          color={ROLE_COLORS[role]}
          className="px-3 py-1 font-medium rounded-full text-xs"
        >
          {ROLE_LABELS[role]}
        </Tag>
      ),
      filters: [
        { text: 'All Roles', value: 'ALL' },
        { text: 'Super Admin', value: 'SUPER_ADMIN' },
        { text: 'Admin', value: 'ADMIN' },
        { text: 'Individual', value: 'INDIVIDUAL' },
      ],
      onFilter: (value: string, record: User) =>
        value === 'ALL' ? true : record.role === value,
      width: 140,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'status',
      render: (isActive: boolean, user: User) => (
        <div>
          <Switch
            checked={isActive}
            size="small"
            onChange={(checked) => handleStatusChange(checked, user)}
            className={isActive ? 'bg-green-500' : 'bg-gray-300'}
          />
          <span className="ml-2 text-xs">
            {isActive ? 'Active' : 'Inactive'}
          </span>
          {user.accountLocked && (
            <Tag color="error" className="ml-2">
              <LockOutlined /> Locked
            </Tag>
          )}
        </div>
      ),
      filters: [
        { text: 'All', value: 'all' },
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value: string, record: User) =>
        value === 'all' ? true :
        value === 'active' ? record.isActive :
        !record.isActive,
      width: 160,
    },
    {
      title: 'Security',
      key: 'security',
      render: (_: any, user: User) => (
        <Space size="small">
          {user.mfaEnabled ? (
            <Tooltip title="MFA Enabled">
              <Badge status="success" text={<IeOutlined className="text-green-500" />} />
            </Tooltip>
          ) : (
            <Tooltip title="MFA Disabled">
              <Badge status="default" text={<IeOutlined className="text-gray-400" />} />
            </Tooltip>
          )}

          {user.accountLocked ? (
            <Tooltip title={`Account locked until ${new Date(user.accountLockedUntil!).toLocaleString()}`}>
              <LockOutlined className="text-red-500" />
            </Tooltip>
          ) : null}

          {user.failedLoginAttempts > 0 && !user.accountLocked ? (
            <Tooltip title={`${user.failedLoginAttempts} failed login attempts`}>
              <Badge count={user.failedLoginAttempts} size="small" className="security-badge" />
            </Tooltip>
          ) : null}
        </Space>
      ),
      width: 100,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => (
        <Tooltip title={new Date(text).toLocaleString()}>
          {new Date(text).toLocaleDateString()}
        </Tooltip>
      ),
      sorter: (a: User, b: User) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      responsive: ['md'],
      width: 120,
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text: string) => (
        <Tooltip title={new Date(text).toLocaleString()}>
          {new Date(text).toLocaleDateString()}
        </Tooltip>
      ),
      sorter: (a: User, b: User) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      responsive: ['lg'],
      width: 140,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, user: User) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              className="text-gray-500 hover:text-blue-500 transition-colors"
              onClick={() => handleOpenUserDetails(user)}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                {
                  key: '1',
                  icon: <EyeOutlined />,
                  label: 'View Details',
                  onClick: () => handleOpenUserDetails(user)
                },
                {
                  key: '2',
                  icon: <EditOutlined />,
                  label: 'Edit User'
                },
                {
                  key: '3',
                  icon: <SendOutlined />,
                  label: 'Send Reset Password'
                },
                user.accountLocked ? {
                  key: '4',
                  icon: <LockOutlined />,
                  label: 'Unlock Account'
                } : null,
                {
                  type: 'divider'
                },
                {
                  key: '5',
                  icon: <DeleteOutlined />,
                  label: 'Delete User',
                  danger: true
                }
              ].filter(Boolean) as any
            }}
            trigger={['click']}
          >
            <Button
              type="text"
              icon={<EllipsisOutlined />}
              size="small"
              className="text-gray-500 hover:text-blue-500 transition-colors"
            />
          </Dropdown>
        </Space>
      ),
      width: 100,
      fixed: 'right' as 'right',
    },
  ];

  // Tab items
  const tabItems: TabsProps['items'] = [
    {
      key: 'all',
      label: (
        <span>
          <UserOutlined /> All Users
          <Tag className="ml-2 rounded-full">{userStats.total}</Tag>
        </span>
      ),
    },
    {
      key: 'active',
      label: (
        <span>
          <CheckCircleOutlined /> Active
          <Tag color="success" className="ml-2 rounded-full">{userStats.active}</Tag>
        </span>
      ),
    },
    {
      key: 'admin',
      label: (
        <span>
          <UserSwitchOutlined /> Admins
          <Tag color="blue" className="ml-2 rounded-full">{userStats.admin}</Tag>
        </span>
      ),
    },
    {
      key: 'individual',
      label: (
        <span>
          <TeamOutlined /> Individual Users
          <Tag color="green" className="ml-2 rounded-full">{userStats.individual}</Tag>
        </span>
      )
    },
    {
      key: 'locked',
      label: (
        <span>
          <LockOutlined /> Locked Accounts
          <Tag color="error" className="ml-2 rounded-full">{userStats.locked}</Tag>
        </span>
      )
    }
  ];

  return (
    <div className="users-page">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <Title level={3} className="m-0 flex items-center">
              <UserOutlined className="mr-2 text-blue-500" /> Users
            </Title>
            <Text type="secondary">Manage your platform users and access rights</Text>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button icon={<ReloadOutlined />} onClick={simulateLoading}>
              Refresh
            </Button>
            <Button icon={<DownloadOutlined />} type="primary" ghost>
              Export
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700"
            >
              Add User
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={12} sm={8} md={8} lg={4}>
          <Card className="stat-card border-0 shadow-sm hover:shadow-md transition-all">
            <Statistic
              title={<div className="text-gray-500 flex items-center"><UserOutlined className="mr-1 text-blue-500" /> Total Users</div>}
              value={userStats.total}
              className="text-center"
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={8} lg={4}>
          <Card className="stat-card border-0 shadow-sm hover:shadow-md transition-all">
            <Statistic
              title={<div className="text-gray-500 flex items-center"><CheckCircleOutlined className="mr-1 text-green-500" /> Active</div>}
              value={userStats.active}
              className="text-center"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={8} lg={4}>
          <Card className="stat-card border-0 shadow-sm hover:shadow-md transition-all">
            <Statistic
              title={<div className="text-gray-500 flex items-center"><StopOutlined className="mr-1 text-red-500" /> Inactive</div>}
              value={userStats.inactive}
              className="text-center"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={8} lg={4}>
          <Card className="stat-card border-0 shadow-sm hover:shadow-md transition-all">
            <Statistic
              title={<div className="text-gray-500 flex items-center"><UserSwitchOutlined className="mr-1 text-indigo-500" /> Admin</div>}
              value={userStats.admin}
              className="text-center"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={8} lg={4}>
          <Card className="stat-card border-0 shadow-sm hover:shadow-md transition-all">
            <Statistic
              title={<div className="text-gray-500 flex items-center"><IeOutlined className="mr-1 text-cyan-500" /> MFA Enabled</div>}
              value={userStats.withMfa}
              className="text-center"
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={8} lg={4}>
          <Card className="stat-card border-0 shadow-sm hover:shadow-md transition-all">
            <Statistic
              title={<div className="text-gray-500 flex items-center"><LockOutlined className="mr-1 text-amber-500" /> Locked</div>}
              value={userStats.locked}
              className="text-center"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Search & Filters */}
      <Card className="mb-6 border-0 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search users by name or email..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              allowClear
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Dropdown
              menu={{
                items: [
                  { key: 'ALL', label: 'All Roles' },
                  { key: 'SUPER_ADMIN', label: 'Super Admin' },
                  { key: 'ADMIN', label: 'Admin' },
                  { key: 'INDIVIDUAL', label: 'Individual' },
                ],
                onClick: ({ key }) => setRoleFilter(key as UserRole | 'ALL'),
                selectedKeys: [roleFilter]
              }}
            >
              <Button icon={<FilterOutlined />}>
                {roleFilter === 'ALL' ? 'All Roles' : ROLE_LABELS[roleFilter as UserRole]}
              </Button>
            </Dropdown>
            <Dropdown
              menu={{
                items: [
                  { key: 'all', label: 'All Status' },
                  { key: 'active', label: 'Active' },
                  { key: 'inactive', label: 'Inactive' },
                ],
                onClick: ({ key }) => setStatusFilter(key as 'active' | 'inactive' | 'all'),
                selectedKeys: [statusFilter]
              }}
            >
              <Button icon={<FilterOutlined />}>
                Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </Button>
            </Dropdown>
          </div>
        </div>
      </Card>

      {/* Tabs and User Table */}
      <Card className="users-table-card border-0 shadow-sm">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="mb-4"
        />

        <Table
          dataSource={filteredUsers}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} users`
          }}
          className="users-table"
          scroll={{ x: 'max-content' }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="py-6">
                    <p className="text-gray-500 mb-4">No users found</p>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setIsCreateModalOpen(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-md"
                    >
                      Add New User
                    </Button>
                  </div>
                }
              />
            ),
          }}
        />
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          visible={isDetailsModalOpen}
          user={selectedUser}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      {/* Create User Modal */}
      <Modal
        title={
          <div className="flex items-center">
            <PlusOutlined className="text-blue-500 mr-2" />
            <span>Add New User</span>
          </div>
        }
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsCreateModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
          >
            Create User
          </Button>,
        ]}
        width={700}
        className="user-form-modal"
      >
        <Form layout="vertical" className="pt-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email address' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
              >
                <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="Enter email address" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone Number">
                <Input placeholder="Enter phone number (optional)" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="User Role"
                rules={[{ required: true, message: 'Please select a role' }]}
              >
                <Select placeholder="Select role">
                  <Option value="SUPER_ADMIN">Super Admin</Option>
                  <Option value="ADMIN">Admin</Option>
                  <Option value="INDIVIDUAL">Individual</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="companyId" label="Company">
                <Select placeholder="Select company (optional)">
                  <Option value={8}>Tech Solutions Ltd</Option>
                  <Option value={12}>ABC Corporation</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="mfaEnabled" label="Security Options" initialValue={false}>
                <div className="pt-2">
                  <Switch size="small" /> <span className="ml-2">Require MFA</span>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Custom Styling */}
      <style jsx global>{`
        .users-page {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stat-card {
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
        }

        .users-table-card {
          border-radius: 12px;
          overflow: hidden;
        }

        .ant-tabs-nav {
          margin-bottom: 16px !important;
        }

        .ant-tabs-tab {
          padding: 8px 16px !important;
        }

        .ant-tabs-tab-active {
          background-color: #f0f7ff !important;
          border-radius: 8px !important;
        }

        .users-table .ant-table-thead > tr > th {
          background-color: #f9fafb;
          color: #374151;
          font-weight: 600;
        }

        .users-table .ant-table-tbody > tr:hover > td {
          background-color: rgba(240, 240, 255, 0.5) !important;
        }

        .security-badge .ant-badge-count {
          background-color: #ff7875;
        }

        .search-input {
          border-radius: 8px;
        }

        .user-form-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

// User Details Modal Component
const UserDetailsModal: React.FC<{ visible: boolean; user: any; onClose: () => void }> = ({
  visible,
  user,
  onClose
}) => {
  if (!user) return null;

  const tabItems: TabsProps['items'] = [
    {
      key: 'info',
      label: (
        <span>
          <UserOutlined /> User Info
        </span>
      ),
      children: (
        <div className="p-4">
          <Row gutter={[24, 16]}>
            <Col span={24}>
              <div className="flex items-center mb-6">
                <Avatar
                  size={64}
                  style={{ backgroundColor: ['#1890ff', '#52c41a', '#722ed1'][user.id % 3] }}
                  className="mr-4 flex items-center justify-center text-white text-xl"
                >
                  {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()}
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold mb-1">{user.firstName} {user.lastName}</h2>
                  <div className="flex items-center text-gray-500">
                    <MailOutlined className="mr-1" />
                    <a href={`mailto:${user.email}`} className="text-blue-500 hover:underline">
                      {user.email}
                    </a>
                  </div>
                  {user.phone && (
                    <div className="text-gray-500 mt-1">
                      {user.phone}
                    </div>
                  )}
                </div>
              </div>
            </Col>

            <Col xs={24} md={12}>
              <Card title="User Details" bordered={false} className="h-full shadow-sm">
                <div className="space-y-4">
                  <div>
                    <div className="text-gray-500 text-sm">Role</div>
                    <div className="font-medium mt-1">
                      <Tag
                        color={
                          user.role === 'SUPER_ADMIN' ? '#1890ff' :
                          user.role === 'ADMIN' ? '#722ed1' :
                          '#52c41a'
                        }
                        className="px-3 py-1"
                      >
                        {user.role === 'SUPER_ADMIN' ? 'Super Admin' :
                         user.role === 'ADMIN' ? 'Admin' :
                         'Individual User'}
                      </Tag>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500 text-sm">Status</div>
                    <div className="font-medium mt-1">
                      {user.isActive ? (
                        <Tag color="success" className="px-3 py-1">
                          <CheckCircleOutlined /> Active
                        </Tag>
                      ) : (
                        <Tag color="error" className="px-3 py-1">
                          <StopOutlined /> Inactive
                        </Tag>
                      )}

                      {user.accountLocked && (
                        <Tag color="error" className="ml-2 px-3 py-1">
                          <LockOutlined /> Account Locked
                        </Tag>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500 text-sm">Company</div>
                    <div className="font-medium mt-1">
                      {user.company ? user.company.name : 'Not associated with any company'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-gray-500 text-sm">Created On</div>
                      <div className="font-medium mt-1">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div>
                      <div className="text-gray-500 text-sm">Last Updated</div>
                      <div className="font-medium mt-1">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card title="Security Settings" bordered={false} className="h-full shadow-sm">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center">
                      <div className="text-gray-500 text-sm">Multi-Factor Authentication</div>
                      <Switch checked={user.mfaEnabled} size="small" disabled />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {user.mfaEnabled ? 'MFA is enabled for this account' : 'MFA is not enabled for this account'}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500 text-sm">Account Security</div>
                    <div className="bg-gray-50 p-3 rounded-lg mt-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Failed Login Attempts</span>
                        <span className="font-medium">{user.failedLoginAttempts}</span>
                      </div>

                      {user.lastFailedLogin && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Last Failed Login</span>
                          <span className="font-medium">{new Date(user.lastFailedLogin).toLocaleString()}</span>
                        </div>
                      )}

                      {user.accountLocked && (
                        <div className="flex justify-between items-center text-red-500">
                          <span className="text-sm">Locked Until</span>
                          <span className="font-medium">{new Date(user.accountLockedUntil).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {user.passwordLastChanged && (
                    <div>
                      <div className="text-gray-500 text-sm">Password Last Changed</div>
                      <div className="font-medium mt-1">
                        {new Date(user.passwordLastChanged).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  <Divider />

                  <div className="flex gap-2">
                    <Button type="default" icon={<LockOutlined />} size="small">
                      Reset Password
                    </Button>
                    {user.accountLocked && (
                      <Button type="primary" icon={<UnlockOutlined />} size="small">
                        Unlock Account
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      key: 'consent',
      label: (
        <span>
          <SafetyOutlined /> Privacy & Consent
        </span>
      ),
      children: (
        <div className="p-4">
          <Card bordered={false} className="shadow-sm">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-500 text-sm">Data Processing Consent</div>
                  <Switch checked={!!user.dataConsentDate} size="small" disabled />
                </div>
                {user.dataConsentDate ? (
                  <div className="text-xs text-gray-500 mt-1">
                    User consented to data processing on {new Date(user.dataConsentDate).toLocaleDateString()}
                    {user.dataConsentVersion && ` (version ${user.dataConsentVersion})`}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 mt-1">
                    User has not consented to data processing
                  </div>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <div className="text-gray-500 text-sm">Marketing Communications</div>
                  <Switch checked={user.marketingConsent} size="small" disabled />
                </div>
                {user.marketingConsentDate ? (
                  <div className="text-xs text-gray-500 mt-1">
                    User opted in to marketing communications on {new Date(user.marketingConsentDate).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 mt-1">
                    User has not opted in to marketing communications
                  </div>
                )}
              </div>

              {user.lastPrivacyNoticeView && (
                <div>
                  <div className="text-gray-500 text-sm">Last Privacy Notice Viewed</div>
                  <div className="font-medium mt-1">
                    {new Date(user.lastPrivacyNoticeView).toLocaleDateString()}
                  </div>
                </div>
              )}

              <Divider />

              <div>
                <div className="text-gray-500 text-sm">Social Logins</div>
                <div className="flex gap-3 mt-2">
                  {user.googleId ? (
                    <Tag color="volcano" className="px-3 py-1">Google</Tag>
                  ) : null}

                  {user.appleId ? (
                    <Tag color="default" className="px-3 py-1">Apple</Tag>
                  ) : null}

                  {user.linkedinId ? (
                    <Tag color="blue" className="px-3 py-1">LinkedIn</Tag>
                  ) : null}

                  {!user.googleId && !user.appleId && !user.linkedinId && (
                    <span className="text-gray-500">No connected social logins</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      key: 'activity',
      label: (
        <span>
          <HistoryOutlined /> Activity Log
        </span>
      ),
      children: (
        <div className="p-4">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="py-6">
                <p className="text-gray-500">No activity logs available for this user</p>
              </div>
            }
          />
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={850}
      className="user-details-modal"
      centered
    >
      <div className="user-details-header bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center m-0">
            <UserOutlined className="mr-2 text-blue-500" /> User Details
          </h2>
          <Space>
            <Button onClick={onClose}>Close</Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
            >
              Edit User
            </Button>
          </Space>
        </div>
      </div>

      <div>
        <Tabs defaultActiveKey="info" items={tabItems} className="user-details-tabs" />
      </div>

      <style jsx global>{`
        .user-details-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
          padding: 0;
        }

        .user-details-modal .ant-modal-body {
          padding: 0;
        }

        .user-details-modal .ant-modal-close {
          top: 16px;
          right: 16px;
        }

        .user-details-tabs .ant-tabs-nav {
          padding: 0 16px;
          margin: 0 !important;
        }

        .user-details-tabs .ant-tabs-nav-wrap {
          padding: 16px 0 0;
        }

        .user-details-tabs .ant-tabs-content-holder {
          overflow: auto;
          max-height: 60vh;
        }
      `}</style>
    </Modal>
  );
};



export default UsersPage;
