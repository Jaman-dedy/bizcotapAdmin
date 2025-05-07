// components/LinkFormModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Switch, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { linkTypeForms } from '../data/tagWizardData';

const { TextArea } = Input;

const LinkFormModal = ({ visible, link, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  
  // Get form fields for this link type
  const getFormFields = () => {
    if (!link) return [];
    
    // Use specific form fields for this link type or fallback to default
    return (linkTypeForms[link.type] || linkTypeForms.DEFAULT).fields;
  };
  
  // Reset form when modal opens or link changes
  useEffect(() => {
    if (visible && link) {
      form.resetFields();
      
      // Set initial values
      const initialValues = {};
      getFormFields().forEach(field => {
        // Use link value or field default value
        initialValues[field.name] = link[field.name] !== undefined ? 
          link[field.name] : field.defaultValue;
      });
      
      form.setFieldsValue(initialValues);
      setFormData(initialValues);
    }
  }, [visible, link, form]);
  
  // Handle form submission
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        onSave(link.id, values);
        onCancel();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };
  
  if (!link) return null;
  
  return (
    <Modal
      title={
        <div className="flex items-center">
          <div className="relative w-6 h-6 mr-2">
            <Image 
              src={link.icon} 
              alt={link.title}
              width={24} 
              height={24}
              className="object-contain" 
            />
          </div>
          <span>Edit {link.title}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Save
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onValuesChange={(changedValues, allValues) => setFormData(allValues)}
      >
        {getFormFields().map(field => {
          if (field.type === 'input') {
            return (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={field.required ? [{ required: true, message: `Please input ${field.label}!` }] : []}
              >
                <Input placeholder={link.placeholder || field.label} />
              </Form.Item>
            );
          } else if (field.type === 'textarea') {
            return (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={field.required ? [{ required: true, message: `Please input ${field.label}!` }] : []}
              >
                <TextArea rows={3} placeholder={field.label} />
              </Form.Item>
            );
          } else if (field.type === 'switch') {
            return (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            );
          } else if (field.type === 'image') {
            return (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            );
          }
          return null;
        })}

        {/* Testing functionality for links that support it */}
        {link.type === 'WHATSAPP' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button 
              type="link" 
              href={`https://wa.me/${formData.value?.replace(/\D/g, '')}`} 
              target="_blank"
              disabled={!formData.value}
            >
              Test WhatsApp Link
            </Button>
          </div>
        )}
        
        {link.type === 'PHONE' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button 
              type="link" 
              href={`tel:${formData.value}`} 
              target="_blank"
              disabled={!formData.value}
            >
              Test Call Link
            </Button>
          </div>
        )}
        
        {link.type === 'EMAIL' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button 
              type="link" 
              href={`mailto:${formData.value}`} 
              target="_blank"
              disabled={!formData.value}
            >
              Test Email Link
            </Button>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default LinkFormModal;