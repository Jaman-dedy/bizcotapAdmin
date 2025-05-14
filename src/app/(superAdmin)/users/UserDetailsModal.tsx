// components/dashboard/modals/UserDetailsModal.tsx
import React from 'react';
import {
  Modal, Button, Tabs, Typography, Avatar, Card,
  Row, Col, Tag, Switch, Divider, Space, Empty
} from 'antd';
import {
  UserOutlined, EditOutlined, LockOutlined, MailOutlined,
  CheckCircleOutlined, StopOutlined, ShieldOutlined,
  SafetyOutlined, HistoryOutlined, UnlockOutlined
} from '@ant-design/icons';
import type { TabsProps } from 'antd';

const { Title, Text } = Typography;

interface UserDetailsModalProps {
  visible: boolean;
  user: any;
  onClose: () => void;
  onEdit?: (user: any) => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  visible,
  user,
  onClose,
  onEdit
}) => {
  if (!user) return null;

  // Get avatar initials and color
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (id: number) => {
    const colors = ['#1890ff', '#52c41a', '#722ed1', '#faad14', '#eb2f96'];
    return colors[id % colors.length];
  };

  const handleEditUser = () => {
    if (onEdit) {
      onEdit(user);
    }
  };

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
                  style={{ backgroundColor: getAvatarColor(user.id) }}
                  className="mr-4 flex items-center justify-center text-white text-xl"
                >
                  {getInitials(user.firstName, user.lastName)}
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
              onClick={handleEditUser}
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

        .user-details-modal .ant-card {
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .user-details-modal .ant-card:hover {
          box-shadow: 0 3px 6px rgba(0,0,0,0.15);
        }

        .user-details-modal .ant-card-head {
          border-bottom: 1px solid #f0f0f0;
          padding: 12px 16px;
        }

        .user-details-modal .ant-card-body {
          padding: 16px;
        }

        .user-details-modal .ant-tag {
          margin-right: 0;
          border: none;
        }
      `}</style>
    </Modal>
  );
};
