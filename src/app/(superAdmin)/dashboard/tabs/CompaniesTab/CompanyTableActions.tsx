import React from 'react';
import { Button, Tooltip, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDeleteCompany } from '@/hooks/companies/useCompanies';
import type { Company } from '@/types/company';

interface CompanyTableActionsProps {
  company: Company;
  onEdit: (company: Company) => void;
  onRefresh: () => void;
  onSelectCompany: (id: number | null) => void;
  selectedCompany: number | null;
}

const CompanyTableActions: React.FC<CompanyTableActionsProps> = ({
  company,
  onEdit,
  onRefresh,
  onSelectCompany,
  selectedCompany
}) => {
  const deleteCompanyMutation = useDeleteCompany();

  const handleDeleteCompany = async () => {
    try {
      await deleteCompanyMutation.mutateAsync(company.id);
      message.success({
        content: `${company.name} deleted successfully`,
        className: 'premium-message-success',
      });
      onRefresh();
      if (selectedCompany === company.id) {
        onSelectCompany(null);
      }
    } catch (error) {
      message.error({
        content: 'Failed to delete company',
        className: 'premium-message-error',
      });
    }
  };

  return (
    <Space size="middle">
      <Tooltip title="Edit Company">
        <Button
          icon={<EditOutlined />}
          type="text"
          size="small"
          className="text-gray-500 hover:text-blue-500 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(company);
          }}
        />
      </Tooltip>
      <Tooltip title="Delete Company">
        <Popconfirm
          title="Delete Company"
          description={
            <div>
              <p>Are you sure you want to delete <strong>{company.name}</strong>?</p>
              <p className="text-red-500 text-sm mt-1">This action cannot be undone.</p>
            </div>
          }
          onConfirm={(e) => {
            e?.stopPropagation();
            handleDeleteCompany();
          }}
          okText="Yes, Delete"
          cancelText="Cancel"
          placement="left"
          icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          okButtonProps={{
            danger: true,
            className: 'bg-red-500 hover:bg-red-600'
          }}
        >
          <Button
            icon={<DeleteOutlined />}
            type="text"
            size="small"
            danger
            className="hover:text-red-500 transition-colors"
            onClick={(e) => e.stopPropagation()}
          />
        </Popconfirm>
      </Tooltip>
    </Space>
  );
};

export default CompanyTableActions;
