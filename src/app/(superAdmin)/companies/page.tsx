'use client';
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Input, 
  Dropdown, 
  Modal, 
  message, 
  Tag, 
  Avatar,
  TableProps,
  Form,
  Select,
  Row,
  Col,
  Divider,
  Upload,
  UploadProps,
  App
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  MoreOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ExclamationCircleOutlined, 
  TeamOutlined, 
  UserOutlined,
  LinkOutlined,
  BankOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { RcFile } from 'antd/es/upload';
import companiesService, { Company, CreateCompanyDto } from '@/services/CompaniesService';
import { User } from '@/services/tagsService';

const { Title, Text } = Typography;
const { Option } = Select;

// List of common industries
const INDUSTRIES = [
  'Technology', 
  'Healthcare', 
  'Finance', 
  'Education', 
  'Manufacturing', 
  'Retail', 
  'Entertainment',
  'Real Estate',
  'Transportation',
  'Energy',
  'Consulting',
  'Food & Beverage',
  'Hospitality',
  'Media',
  'Other'
];

// Create the CompanyModalForm component
const CreateCompanyModal = ({ 
  visible, 
  onCancel, 
  onCreate, 
  loading, 
  users 
}: {
  visible: boolean;
  onCancel: () => void;
  onCreate: (values: CreateCompanyDto) => Promise<void>;
  loading: boolean;
  users: User[];
}) => {
  const [form] = Form.useForm();
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Reset form fields when modal becomes visible
  useEffect(() => {
    if (visible) {
      form.resetFields();
      setLogoFile(null);
    }
  }, [visible, form]);

  // Handle logo upload
  const handleLogoChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'done') {
      // Get the uploaded file
      const file = info.file.originFileObj as RcFile;
      setLogoFile(file);
      message.success(`${info.file.name} uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload failed.`);
    }
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Handle logo file if available
      if (logoFile) {
        // Create FormData for logo upload
        const formData = new FormData();
        formData.append('file', logoFile);
        
        try {
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            values.logo = uploadData.url;
          }
        } catch (error) {
          console.log('Error uploading logo:', error);
          message.warning('Logo upload failed, continuing without logo');
        }
      }
      
      await onCreate(values);
    } catch (error) {
      console.log('Form validation failed:', error);
    }
  };

  // File upload props
  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/temp-upload', // Temporary endpoint just for UI preview
    headers: {
      authorization: 'authorization-text',
    },
    onChange: handleLogoChange,
    maxCount: 1,
    accept: 'image/*',
    listType: 'picture-card',
    showUploadList: true,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
      }
      return false; // Prevent automatic upload
    },
  };

  return (
    <Modal
      title="Create New Company"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Create Company
        </Button>,
      ]}
      destroyOnClose={true}
    >
      <Form
        form={form}
        layout="vertical"
        name="createCompanyForm"
        initialValues={{
          name: '',
          industry: undefined,
          website: '',
          ownerId: undefined
        }}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="Company Name"
              rules={[
                { required: true, message: 'Please enter company name' }
              ]}
            >
              <Input 
                placeholder="Enter company name" 
                prefix={<BankOutlined className="text-gray-400" />} 
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="industry"
              label="Industry"
            >
              <Select 
                placeholder="Select industry" 
                allowClear
                showSearch
                optionFilterProp="children"
              >
                {INDUSTRIES.map(industry => (
                  <Option key={industry} value={industry}>{industry}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="website"
              label="Website"
              rules={[
                { 
                  type: 'url', 
                  message: 'Please enter a valid URL',
                  warningOnly: true
                }
              ]}
            >
              <Input 
                placeholder="https://example.com" 
                prefix={<LinkOutlined className="text-gray-400" />} 
              />
            </Form.Item>
          </Col>
          
          <Col xs={24} md={12}>
            <Form.Item
              name="ownerId"
              label="Company Owner"
              rules={[
                { required: true, message: 'Please select a company owner' }
              ]}
            >
              <Select 
                placeholder="Select company owner" 
                loading={users.length === 0}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option && typeof option.children === 'string' 
                    ? (option.children as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                    : false
                }
              >
                {users.map(user => (
                  <Option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider />
        
        <Form.Item
          label="Company Logo"
          name="logoUpload"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload {...uploadProps}>
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload Logo</div>
            </div>
          </Upload>
        </Form.Item>
        <div className="mb-4">
          <Text type="secondary">
            Recommended: Square image, 400x400px or larger
          </Text>
        </div>
      </Form>
    </Modal>
  );
};

export default function CompaniesListPage() {
  const router = useRouter();
  const [companiesData, setCompaniesData] = useState<{
    data: Company[];
    total?: number;
    page?: number;
    pageSize?: number;
  }>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  
  // Access companies array from the data structure
  const companies = companiesData.data || [];
  
  // Fetch companies data
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companiesService.getAllCompanies();
      
      // Handle both array and paginated response formats
      if (Array.isArray(response)) {
        setCompaniesData({ data: response, total: response.length });
      } else {
        setCompaniesData(response);
      }
    } catch (error) {
      console.log('Error fetching companies:', error);
      message.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCompanies();
  }, []);
  
  // Fetch users for owner selection
  const fetchUsers = async () => {
    try {
      const response = await companiesService.getAvailableUsers();
      setUsers(response);
    } catch (error) {
      console.log('Error fetching users:', error);
      message.error('Failed to load users');
    }
  };
  
  // Filter companies based on search text
  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (company.industry?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (company.owner?.firstName?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
    (company.owner?.lastName?.toLowerCase() || '').includes(searchText.toLowerCase())
  );
  
  // Handle company deletion
  const handleDeleteCompany = (companyId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this company?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone. All associated data will be permanently removed.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const success = await companiesService.deleteCompany(companyId);
          if (success) {
            setCompaniesData({
              ...companiesData,
              data: companies.filter(company => company.id !== companyId),
              total: (companiesData.total || 0) - 1
            });
            message.success('Company deleted successfully');
          } else {
            message.error('Failed to delete company');
          }
        } catch (error) {
          console.log('Error deleting company:', error);
          message.error('Failed to delete company');
        }
      },
    });
  };
  
  // Handle opening create modal
  const showCreateModal = () => {
    fetchUsers();
    setCreateModalVisible(true);
  };
  
  // Handle company creation
  const handleCreateCompany = async (values: CreateCompanyDto) => {
    try {
      setCreateLoading(true);
      
      // Create company using the service
      const company = await companiesService.createCompany(values);
      
      if (company) {
        message.success('Company created successfully');
        setCreateModalVisible(false);
        // Refresh companies list
        fetchCompanies();
      } else {
        message.error('Failed to create company');
      }
    } catch (error) {
      console.log('Error creating company:', error);
      message.error('Failed to create company');
    } finally {
      setCreateLoading(false);
    }
  };
  
  // Define table columns
  const columns: TableProps<Company>['columns'] = [
    {
        title: 'Company',
        key: 'name',
        render: (_, record) => {
          // Generate initials from company name
          const initials = record.name
            ? record.name
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .substring(0, 2)
            : '';
      
          return (
            <Space>
              {record.logo ? (
                <Avatar 
                  size={40} 
                  src={record.logo} 
                  style={{ backgroundColor: '#1a4da2' }}
                  onError={() => false}
                />
              ) : (
                <Avatar 
                  size={40}
                  style={{ backgroundColor: '#1a4da2' }}
                >
                  {initials}
                </Avatar>
              )}
              <div>
                <div className="font-medium">{record.name}</div>
                {record.industry && <Text type="secondary">{record.industry}</Text>}
              </div>
            </Space>
          );
        },
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Owner',
        key: 'owner',
        render: (_, record) => {
          return (
            <Space>
              {record.owner ? (
                <span>{`${record.owner.firstName} ${record.owner.lastName}`}</span>
              ) : (
                <Text type="secondary">Not assigned</Text>
              )}
            </Space>
          );
        },
      },
    {
      title: 'Employees',
      key: 'employees',
      render: (_, record) => (
        <Tag color="blue">{record.employees?.length || 0} members</Tag>
      ),
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: website => (
        website ? (
          <a href={website} target="_blank" rel="noopener noreferrer" className='!text-blue-500'>
            <LinkOutlined className="mr-1" />
            {website.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <Text type="secondary">-</Text>
        )
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                icon: <EditOutlined />,
                label: 'Edit',
                onClick: () => router.push(`/companies/edit/${record.id}`),
              },
              {
                key: 'manage-employees',
                icon: <TeamOutlined />,
                label: 'Manage Employees',
                onClick: () => router.push(`/companies/${record.id}/employees`),
              },
              {
                type: 'divider',
              },
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: 'Delete',
                danger: true,
                onClick: () => handleDeleteCompany(record.id),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <App>
      <div className="p-6 max-w-12xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Title level={3}>Companies</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showCreateModal}
          >
            Create Company
          </Button>
        </div>
        
        <Card className="shadow-md rounded-lg">
          <div className="mb-4">
            <Input
              placeholder="Search companies..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              className="w-64"
            />
          </div>
          
          <Table
            dataSource={filteredCompanies}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              total: companiesData.total || filteredCompanies.length,
              showTotal: (total) => `Total ${total} companies`
            }}
            locale={{
              emptyText: (
                <div className="py-8 text-center">
                  <TeamOutlined style={{ fontSize: '24px', color: '#d9d9d9' }} />
                  <p className="mt-2 text-gray-500">No companies found</p>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />} 
                    onClick={showCreateModal}
                    className="mt-3"
                  >
                    Create Company
                  </Button>
                </div>
              )
            }}
          />
        </Card>
        
        {/* Use the extracted CreateCompanyModal component with proper props */}
        <CreateCompanyModal
          visible={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          onCreate={handleCreateCompany}
          loading={createLoading}
          users={users}
        />
      </div>
    </App>
  );
}