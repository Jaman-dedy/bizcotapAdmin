'use client';

import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Card,
  Typography,
  Select,
  Row,
  Col,
  Switch,
  Steps,
  Divider,
  Checkbox,
  Input,
  notification
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  LeftOutlined,
  ArrowRightOutlined,
  InfoCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
const { TextArea } = Input;

// Import components and data
import DigitalCardPreview from './components/DigitalCardPreview';
import ColorPicker from './components/ColorPicker';
import LayoutOption from './components/LayoutOption';
import SortableLinksList from './components/SortableLinksList';
import AddLinkModal from './components/AddLinkModal';
import LinkFormModal from './components/LinkFormModal';
import { steps, cardLayouts, colorOptions } from './data/tagWizardData';
import { useCardData } from '../../../../hooks/useCardData';
import { TagWizardAPI } from '../../../../services/tagWizardAPI';
import ImageUploader from './components/ImageUploader';
import { useCreateTagWithFormData } from '@/hooks/tags/useTags';
import { transformTagData } from '@/utils/tagDataTransformer';
import { useCreateFormConfig } from '@/hooks/tags/useTags';

const { Title, Text } = Typography;

// Main TagWizard Component
const TagWizard = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addLinkModalVisible, setAddLinkModalVisible] = useState(false);
  const [editLinkModalVisible, setEditLinkModalVisible] = useState(false);
  const [currentEditingLink, setCurrentEditingLink] = useState(null);
  const [isPremium, setIsPremium] = useState(false);

  // Use the create tag mutation hook
  const { mutate: createTag, isPending } = useCreateTagWithFormData();
  const { mutate: createFormConfig } = useCreateFormConfig();

  // Custom hook for managing card data
  const {
    formValues,
    setFormValues,
    avatarPreview,
    backgroundPreview,
    logoPreview,
    activeLinks,
    setActiveLinks,
    imagePositions,
    handleFormValuesChange,
    handleFileUpload,
    removeImage,
    addLink,
    removeLink,
    updateLinkValue,
    updateLinkProps,
    reorderLinks,
  } = useCardData();

  // Check premium status
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        // Simulated API call to check premium status
        // const response = await TagWizardAPI.checkPremiumStatus();
        // setIsPremium(response.isPremium);
        setIsPremium(false);
      } catch (error) {
        console.error("Error checking premium status:", error);
        setIsPremium(false);
      }
    };

    checkPremiumStatus();
  }, []);

  // Open edit link modal for a specific link
  const handleEditLink = (linkId) => {
    const link = formValues.links.find(l => l.id === linkId);
    if (link) {
      setCurrentEditingLink(link);
      setEditLinkModalVisible(true);
    }
  };

  // Save link changes
  const handleSaveLinkChanges = (linkId, newValues) => {
    updateLinkProps(linkId, newValues);
  };

  // Handle form submission
  const onFinish = async () => {
    try {
      setLoading(true);
  
      await form.validateFields();
  
      const isLeadCaptureEnabled = form.getFieldValue('enableLeadCapture') || false;
  
      const apiData = transformTagData(formValues);
      
      apiData.hasContact = isLeadCaptureEnabled;
  
      // Prepare the form config data
      const formConfigData = {
        formTitle: form.getFieldValue('leadCaptureTitle') || 'Contact Me',
        nameField: form.getFieldValue('fieldName') ? 'value' : null,
        emailField: form.getFieldValue('fieldEmail') ? 'value' : null,
        phoneField: form.getFieldValue('fieldPhone') ? 'value' : null,
        companyField: form.getFieldValue('fieldCompany') ? 'value' : null,
        messageField: form.getFieldValue('fieldMessage') ? 'value' : null,
        submitButtonText: form.getFieldValue('leadCaptureButton') || 'Submit',
        thankYouMessage: form.getFieldValue('thankYouMessage') || 'Thank you for your message. I will get back to you soon!'
      };
  
      createTag(
        {
          tagData: apiData,
          avatarFile: avatarPreview
        },
        {
          onSuccess: (data) => {
            if (isLeadCaptureEnabled) {
              // Check that data is not null and has the required properties
              if (data && data.tuid && data.id) {
                createFormConfig({
                  tuid: data.tuid,
                  tagIdNumeric: data.id, // Use the id field as tagIdNumeric
                  formConfig: formConfigData
                }, {
                  onSuccess: () => {
                    notification.success({
                      message: 'Digital Card Created',
                      description: 'Your digital card and lead capture form have been created successfully!',
                    });
                    
                    router.push('/tags');
                  },
                  onError: (error) => {
                    console.error('Error creating form config:', error);
                    notification.warning({
                      message: 'Form Config Creation Issue',
                      description: 'Card created but there was an issue with the lead capture form configuration. You can set it up later.',
                    });
                    
                    router.push('/tags');
                  }
                });
              } else {
                console.error('Missing required data for form config:', data);
                notification.warning({
                  message: 'Form Config Creation Issue',
                  description: 'Card created but there was an issue with the lead capture form configuration. You can set it up later.',
                });
                
                router.push('/tags');
              }
            } else {
              notification.success({
                message: 'Digital Card Created',
                description: 'Your digital card has been created successfully!',
              });
              
              // Navigate to the tags list page
              router.push('/tags');
            }
          },
          onError: (error) => {
            console.error('Error creating tag:', error);
  
            notification.error({
              message: 'Creation Failed',
              description: error?.response?.data?.message || 'Failed to create digital card. Please try again.',
            });
          },
          onSettled: () => {
            setLoading(false);
          }
        }
      );
    } catch (error) {
      console.error('Form validation error:', error);
      setLoading(false);
  
      notification.error({
        message: 'Form Validation Failed',
        description: 'Please check all required fields and try again.',
      });
    }
  };

  // Handle next step
  const nextStep = () => {
    form.validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
      });
  };

  // Handle previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Update color selection
  const handleColorChange = (name, color) => {
    const newFormValues = { ...formValues };
    newFormValues.design[name] = color;
    setFormValues(newFormValues);
    form.setFieldsValue({ [name]: color });
  };

  // Handle layout selection
  const handleLayoutChange = (layoutValue) => {
    const newFormValues = { ...formValues };
    newFormValues.design.cardLayout = layoutValue;
    setFormValues(newFormValues);
    form.setFieldsValue({ cardLayout: layoutValue });

    // When selecting standard layout and a background exists, remove it
    if (layoutValue === 'standard' && backgroundPreview) {
      removeImage('background');
    }
  };

  const renderDesignSection = () => {
    const initialValues = {
      cardLayout: formValues.design.cardLayout,
      headerStyle: formValues.design.headerStyle,
      cardBackground: formValues.design.cardBackground,
      headerBackground: formValues.design.headerBackground,
      linkBackground: formValues.design.linkBackground,
      cardText: formValues.design.cardText,
      linkText: formValues.design.linkText,
    };

    console.log("Current card layout:", formValues.design.cardLayout);

    return (
      <Form
        layout="vertical"
        initialValues={initialValues}
        onValuesChange={handleFormValuesChange}
        form={form}
      >
        <div className="mb-6">
          <Row gutter={[24, 24]}>
            <Col xs={24} md={10}>
              <Title level={5}>Card Layout</Title>
              <div className="flex gap-8 items-center mt-3">
                {cardLayouts.map(layout => (
                  <LayoutOption
                    key={layout.value}
                    layout={layout}
                    selected={formValues.design.cardLayout === layout.value}
                    onClick={() => handleLayoutChange(layout.value)}
                  />
                ))}
              </div>
            </Col>
          </Row>

          <Form.Item name="cardLayout" hidden>
            <Input />
          </Form.Item>
        </div>
        <Divider />
        <Row gutter={[24, 24]}>
          <ImageUploader
            type="avatar"
            title="Profile picture"
            filePreview={avatarPreview}
            onUpload={handleFileUpload}
            onRemove={removeImage}
            required={true}
            layoutName={formValues.design.cardLayout} // Pass current layout name
          />

          {/* For standard layout, don't show the cover photo option at all */}
          {formValues.design.cardLayout !== 'standard' && (
            <Col xs={24} md={14}>
              <ImageUploader
                type="background"
                title="Cover photo"
                filePreview={backgroundPreview}
                onUpload={handleFileUpload}
                onRemove={removeImage}
                layoutName={formValues.design.cardLayout}
              />
            </Col>
          )}
        </Row>

        <Divider />
        <Col xs={24} md={24}>
          {/* Card Background Color */}
          <ColorPicker
            name="cardBackground"
            label="Card Background"
            currentColor={formValues.design.cardBackground}
            onChange={handleColorChange}
            isPremium={isPremium}
          />

          {/* Header Background Color */}
          <ColorPicker
            name="headerBackground"
            label="Header Background"
            currentColor={formValues.design.headerBackground}
            onChange={handleColorChange}
            isPremium={isPremium}
          />
        </Col>
      </Form>
    );
  };

  // Render links selection and configuration step
  const renderLinksSection = () => {
    return (
      <div>
        <Title level={5} className="mb-4">Basic Info</Title>
        <Form
          layout="vertical"
          initialValues={{
            firstName: formValues.basicInfo.firstName,
            lastName: formValues.basicInfo.lastName,
            company: formValues.basicInfo.company,
            position: formValues.basicInfo.position,
          }}
          onValuesChange={handleFormValuesChange}
          form={form}
        >
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'First name is required' }]}
              >
                <Input placeholder="First Name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Last name is required' }]}
              >
                <Input placeholder="Last Name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="company"
                label="Company Name"
              >
                <Input placeholder="Company Name" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="position"
                label="Job Title or Role"
              >
                <Input placeholder="Job Title or Role" />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <div className="my-6">
          <div className="flex justify-between items-center">
            <div>
              <Title level={5} className="m-0">Links and Contact Information</Title>
              <Text type="secondary">
                Add links to your websites, social media, and contact information
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddLinkModalVisible(true)}
              size="large"
            >
              Add Section
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <SortableLinksList
            links={formValues.links}
            onRemove={removeLink}
            onEdit={handleEditLink}
            onReorder={reorderLinks}
          />
        </div>

        <AddLinkModal
          visible={addLinkModalVisible}
          onCancel={() => setAddLinkModalVisible(false)}
          onAddLink={addLink}
          activeLinks={activeLinks}
        />

        <LinkFormModal
          visible={editLinkModalVisible}
          link={currentEditingLink}
          onCancel={() => {
            setEditLinkModalVisible(false);
            setCurrentEditingLink(null);
          }}
          onSave={handleSaveLinkChanges}
        />
      </div>
    );
  };

  // Render lead capture form configuration
  const renderLeadCaptureSection = () => {
    const initialValues = {
      enableLeadCapture: formValues.leadCapture.enabled,
      leadCaptureTitle: formValues.leadCapture.title,
      fieldName: formValues.leadCapture.fields.name,
      fieldEmail: formValues.leadCapture.fields.email,
      fieldPhone: formValues.leadCapture.fields.phone,
      fieldCompany: formValues.leadCapture.fields.company,
      fieldMessage: formValues.leadCapture.fields.message,
      leadCaptureButton: formValues.leadCapture.buttonText,
      thankYouMessage: formValues.leadCapture.thankYouMessage,
    };

    return (
      <Form
        layout="vertical"
        initialValues={initialValues}
        onValuesChange={handleFormValuesChange}
        form={form}
      >
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <Title level={5} className="mb-0 mr-2">Enable Lead Capture Form</Title>
            <Form.Item name="enableLeadCapture" valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
          </div>

          <Text type="secondary">
            Allow visitors to send you messages directly through your digital card
          </Text>
        </div>

        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => {
            const enableLeadCapture = getFieldValue('enableLeadCapture');

            return enableLeadCapture ? (
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <Form.Item
                  name="leadCaptureTitle"
                  label="Form Title"
                >
                  <Input placeholder="Contact Me" />
                </Form.Item>

                <div className="mb-4">
                  <Title level={5}>Form Fields</Title>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <Form.Item name="fieldName" valuePropName="checked">
                      <Checkbox>Name</Checkbox>
                    </Form.Item>

                    <Form.Item name="fieldEmail" valuePropName="checked">
                      <Checkbox>Email</Checkbox>
                    </Form.Item>

                    <Form.Item name="fieldPhone" valuePropName="checked">
                      <Checkbox>Phone</Checkbox>
                    </Form.Item>

                    <Form.Item name="fieldCompany" valuePropName="checked">
                      <Checkbox>Company</Checkbox>
                    </Form.Item>

                    <Form.Item name="fieldMessage" valuePropName="checked">
                      <Checkbox>Message</Checkbox>
                    </Form.Item>
                  </div>
                </div>

                <Form.Item
                  name="leadCaptureButton"
                  label="Submit Button Text"
                >
                  <Input placeholder="Submit" />
                </Form.Item>

                <Form.Item
                  name="thankYouMessage"
                  label="Thank You Message"
                >
                  <TextArea
                    placeholder="Thank you for your message. I will get back to you soon!"
                    rows={3}
                  />
                </Form.Item>
              </div>
            ) : (
              <div className="text-center p-8 border border-dashed rounded-lg bg-gray-50">
                <div className="mb-3">
                  <img
                    src="/images/icons/form.svg"
                    alt="Form"
                    className="w-6 h-6 mx-auto opacity-50"
                  />
                </div>
                <Text type="secondary">
                  Lead capture form is disabled. Toggle the switch above to configure it.
                </Text>
              </div>
            );
          }}
        </Form.Item>
      </Form>
    );
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderDesignSection();
      case 1:
        return renderLinksSection();
      case 2:
        return renderLeadCaptureSection();
      default:
        return renderDesignSection();
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-full mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/tags">
          <Button
            icon={<ArrowLeftOutlined />}
            className="mr-4">
          </Button>
        </Link>
        <Title level={4} className="m-0">Create Digital Card</Title>
      </div>

      <Row gutter={[24, 24]}>
        {/* Main Content Column */}
        <Col xs={24} lg={16}>
          {/* Form Content */}
          <Card className="shadow-md rounded-lg">
            <Steps
              current={currentStep}
              onChange={setCurrentStep}
              className="px-2 py-2"
              items={steps.map(step => ({
                title: step.title,
                icon: step.icon
              }))}
            />

            <Divider />
            {renderStepContent()}

            <Divider />

            <div className="flex justify-between mt-6">
              <Button
                onClick={prevStep}
                icon={<LeftOutlined />}
                disabled={currentStep === 0}
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {currentStep < 2 ? (
                  <Button
                    type="primary"
                    onClick={nextStep}
                  >
                    Next <ArrowRightOutlined />
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={onFinish}
                    loading={loading || isPending}
                    icon={<SaveOutlined />}
                  >
                    Create Card
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Sidebar - Live Preview */}
        <Col xs={24} lg={8}>
          <div className="sticky top-6">
            <Card
              title="Card Preview"
              className="shadow-md rounded-lg"
              style={{
                backgroundColor: '#f0f5ff',
                borderColor: '#d6e4ff'
              }}
            >
              <div className="flex justify-center">
                <DigitalCardPreview
                  design={formValues.design}
                  basicInfo={formValues.basicInfo}
                  links={formValues.links}
                  leadCapture={formValues.leadCapture}
                  avatarPreview={avatarPreview}
                  backgroundPreview={backgroundPreview}
                  logoPreview={logoPreview}
                  imagePositions={imagePositions}
                />
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TagWizard;
