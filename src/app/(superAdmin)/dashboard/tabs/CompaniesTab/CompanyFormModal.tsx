import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Upload, Button, Row, Col, Typography, message } from 'antd';
import { PlusOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { useCreateCompany, useUpdateCompany, useIndustries } from '@/hooks/companies/useCompanies';
import type { Company } from '@/types/company';
import type { UploadFile } from 'antd/es/upload/interface';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface CompanyFormModalProps {
  open: boolean;
  editingCompany: Company | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CompanyFormModal: React.FC<CompanyFormModalProps> = ({
  open,
  editingCompany,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [logoFile, setLogoFile] = useState<UploadFile | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Mutations for CRUD operations
  const createCompanyMutation = useCreateCompany();
  const updateCompanyMutation = useUpdateCompany();

  // Fetch industries for dropdown
  const { data: industries } = useIndustries();

  // Reset form when modal opens with new data
  useEffect(() => {
    if (open) {
      form.resetFields();

      if (editingCompany) {
        form.setFieldsValue({
          name: editingCompany.name,
          website: editingCompany.website,
          industry: editingCompany.industry,
          description: editingCompany.description,
          // other fields
        });

        // If there's a logo, set it as the existing file
        if (editingCompany.logo) {
          setLogoFile({
            uid: '-1',
            name: 'Current Logo',
            status: 'done',
            url: editingCompany.logo,
          });
        } else {
          setLogoFile(null);
        }
      } else {
        setLogoFile(null);
      }
    }
  }, [open, editingCompany, form]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      // Prepare the data with the logo if present
      const companyData = {
        ...values,
        ownerId: 1, // This should come from authentication context in a real app
        logo: logoFile?.originFileObj ? await convertFileToBase64(logoFile.originFileObj) : editingCompany?.logo || null,
      };

      if (editingCompany) {
        // Update existing company
        await updateCompanyMutation.mutateAsync({
          id: editingCompany.id,
          data: companyData
        });
        message.success({
          content: `${values.name} updated successfully`,
          className: 'premium-message-success',
        });
      } else {
        // Create new company
        const result = await createCompanyMutation.mutateAsync(companyData);
        message.success({
          content: `${result.name} created successfully`,
          className: 'premium-message-success',
        });
      }

      // Call success callback
      onSuccess();
    } catch (error) {
      console.error('Form validation failed:', error);
      message.error({
        content: 'There was a problem saving the company',
        className: 'premium-message-error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to convert File to base64 for image upload
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Logo upload props
  const uploadProps = {
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return Upload.LIST_IGNORE;
      }
      return false; // Prevent auto upload
    },
    onChange: (info: any) => {
      setLogoFile(info.fileList[0]);
    },
    fileList: logoFile ? [logoFile] : [],
    maxCount: 1,
    listType: 'picture' as const,
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          {editingCompany ? (
            <>
              <EditOutlined className="text-blue-500" />
              <span>Edit Company: {editingCompany.name}</span>
            </>
          ) : (
            <>
              <PlusOutlined className="text-green-500" />
              <span>Add New Company</span>
            </>
          )}
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={submitting}
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
        >
          {editingCompany ? 'Update Company' : 'Create Company'}
        </Button>,
      ]}
      width={600}
      destroyOnClose={true}
      className="company-modal"
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        className="pt-4"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Company Name"
              rules={[{ required: true, message: 'Please enter company name' }]}
            >
              <Input placeholder="Enter company name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="website"
              label="Website"
              rules={[
                { type: 'url', message: 'Please enter a valid URL' }
              ]}
            >
              <Input placeholder="https://example.com" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="industry"
              label="Industry"
            >
              <Select placeholder="Select industry">
                {industries?.map((industry, index) => (
                  <Option key={index} value={industry}>{industry}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="description"
              label="Description"
            >
              <TextArea
                placeholder="Brief description of the company"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="logo"
              label="Company Logo"
              valuePropName="fileList"
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} className="border-dashed">
                  Upload Logo
                </Button>
              </Upload>
            </Form.Item>
            <Text type="secondary" className="text-xs">
              Recommended size: 200x200px. Max size: 2MB. PNG or JPG format.
            </Text>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CompanyFormModal;
