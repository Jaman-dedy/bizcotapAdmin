// Updated useCardData.jsx with message context fix
import { useState } from 'react';
import { App } from 'antd'; // Import App instead of message directly
import { linkCategories, defaultFormValues } from '../app/(superAdmin)/tags/new/data/tagWizardData';

export const useCardData = () => {
  // Get message instance from App's useApp hook (to be used in components)
  // This is what you'll use in your component that uses this hook
  const { message } = App.useApp();
  
  // Main form state
  const [formValues, setFormValues] = useState({
    ...defaultFormValues,
    imagePositions: {
      avatar: { crop: null, zoom: 1, position: { x: 0, y: 0 } },
      background: { crop: null, zoom: 1, position: { x: 0, y: 0 } },
      logo: { crop: null, zoom: 1, position: { x: 0, y: 0 } }
    }
  });
  
  // Image states
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [backgroundPreview, setBackgroundPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  
  // Track active links to prevent duplicates
  const [activeLinks, setActiveLinks] = useState([]);

  // Track image positions separately to avoid nested state issues
  const [imagePositions, setImagePositions] = useState({
    avatar: { crop: null, zoom: 1, position: { x: 0, y: 0 } },
    background: { crop: null, zoom: 1, position: { x: 0, y: 0 } },
    logo: { crop: null, zoom: 1, position: { x: 0, y: 0 } }
  });

  /**
   * Handle form value changes based on current step
   * @param {Object} changedValues - Changed form values
   * @param {Object} allValues - All form values
   */
  const handleFormValuesChange = (changedValues, allValues) => {
    const newFormValues = { ...formValues };
    
    // Check which fields have changed and update accordingly
    if ('cardLayout' in changedValues || 'headerStyle' in changedValues || 
        'cardBackground' in changedValues || 'headerBackground' in changedValues || 
        'linkBackground' in changedValues || 'cardText' in changedValues || 'linkText' in changedValues) {
      // Design options
      newFormValues.design = {
        ...newFormValues.design,
        cardLayout: allValues.cardLayout || newFormValues.design.cardLayout,
        headerStyle: allValues.headerStyle || newFormValues.design.headerStyle,
        cardBackground: allValues.cardBackground || newFormValues.design.cardBackground,
        headerBackground: allValues.headerBackground || newFormValues.design.headerBackground,
        linkBackground: allValues.linkBackground || newFormValues.design.linkBackground,
        cardText: allValues.cardText || newFormValues.design.cardText,
        linkText: allValues.linkText || newFormValues.design.linkText,
      };
    } else if ('firstName' in changedValues || 'lastName' in changedValues || 
              'company' in changedValues || 'position' in changedValues || 
              'location' in changedValues || 'bio' in changedValues || 'buttonLabel' in changedValues) {
      // Basic info fields
      newFormValues.basicInfo = {
        firstName: allValues.firstName || '',
        lastName: allValues.lastName || '',
        company: allValues.company || '',
        position: allValues.position || '',
        location: allValues.location || '',
        bio: allValues.bio || '',
        buttonLabel: allValues.buttonLabel || 'Save Contact',
      };
    } else if ('enableLeadCapture' in changedValues || 'leadCaptureTitle' in changedValues || 
              'fieldName' in changedValues || 'fieldEmail' in changedValues || 
              'fieldPhone' in changedValues || 'fieldCompany' in changedValues || 
              'fieldMessage' in changedValues || 'leadCaptureButton' in changedValues || 
              'thankYouMessage' in changedValues) {
      // Lead capture settings
      newFormValues.leadCapture = {
        enabled: allValues.enableLeadCapture || false,
        title: allValues.leadCaptureTitle || 'Contact Me',
        fields: {
          name: allValues.fieldName !== undefined ? allValues.fieldName : true,
          email: allValues.fieldEmail !== undefined ? allValues.fieldEmail : true,
          phone: allValues.fieldPhone || false,
          company: allValues.fieldCompany || false,
          message: allValues.fieldMessage || false,
        },
        buttonText: allValues.leadCaptureButton || 'Submit',
        thankYouMessage: allValues.thankYouMessage || 'Thank you for your message. I will get back to you soon!'
      };
    }
    
    setFormValues(newFormValues);
  };

  /**
   * Handle file upload for images
   * @param {Event} e - Upload event
   * @param {string} type - Type of image (avatar, background, logo)
   * @param {Object} positionData - Optional position and crop data
   */
  const handleFileUpload = (e, type, positionData = null) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      // No message call here - will be handled by component using this hook
      console.error('You can only upload image files!');
      return { error: 'You can only upload image files!' };
    }
    
    // Validate file size (5MB limit)
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      console.error('Image must be smaller than 5MB!');
      return { error: 'Image must be smaller than 5MB!' };
    }
    
    // Read file and set preview
    const reader = new FileReader();
    reader.onload = () => {
      switch(type) {
        case 'avatar':
          setAvatarFile(file);
          setAvatarPreview(reader.result);
          break;
        case 'background':
          setBackgroundFile(file);
          setBackgroundPreview(reader.result);
          
          // Check dimensions for background images
          if (formValues.design.cardLayout === 'modern') {
            const img = new Image();
            img.onload = () => {
              if (img.width < 600 || img.height < 400) {
                console.warn('For best results with this layout, use an image that is at least 1200×800 pixels');
              }
            };
            img.src = reader.result;
          }
          break;
        case 'logo':
          setLogoFile(file);
          setLogoPreview(reader.result);
          break;
      }
      
      // If position data was provided, update it
      if (positionData) {
        updateImagePosition(type, positionData);
      }
    };
    
    reader.onerror = () => {
      console.error('Failed to load image. Please try another file.');
      return { error: 'Failed to load image. Please try another file.' };
    };
    
    reader.readAsDataURL(file);
    return { success: true, type };
  };

  /**
   * Update image position data
   * @param {string} type - Type of image (avatar, background, logo)
   * @param {Object} positionData - Position and crop data
   */
  const updateImagePosition = (type, positionData) => {
    const newPositions = { ...imagePositions };
    newPositions[type] = positionData;
    
    setImagePositions(newPositions);
    
    // Also update in formValues
    setFormValues(prev => ({
      ...prev,
      imagePositions: {
        ...prev.imagePositions,
        [type]: positionData
      }
    }));
  };

  /**
   * Remove uploaded image
   * @param {string} type - Type of image to remove (avatar, background, logo)
   */
  const removeImage = (type) => {
    switch(type) {
      case 'avatar':
        setAvatarFile(null);
        setAvatarPreview(null);
        break;
      case 'background':
        setBackgroundFile(null);
        setBackgroundPreview(null);
        break;
      case 'logo':
        setLogoFile(null);
        setLogoPreview(null);
        break;
    }
    
    // Reset position data
    const resetPosition = { crop: null, zoom: 1, position: { x: 0, y: 0 } };
    
    // Update image positions
    setImagePositions(prev => ({
      ...prev,
      [type]: resetPosition
    }));
    
    // Update in formValues as well
    setFormValues(prev => ({
      ...prev,
      imagePositions: {
        ...prev.imagePositions,
        [type]: resetPosition
      }
    }));
    
    return { success: true, type };
  };

  /**
   * Add a new link to the card
   * @param {string} linkType - Type of link to add
   */
  const addLink = (linkType) => {
    // Find link info from categories
    const linkInfo = linkCategories
      .flatMap(category => category.links)
      .find(link => link.type === linkType);
    
    if (!linkInfo) return;
    
    // Create new link object
    const newLink = {
      id: Date.now(),
      type: linkType,
      title: linkInfo.name,
      value: '',
      icon: linkInfo.icon,
      placeholder: linkInfo.placeholder
    };
    
    // Add to form values
    setFormValues(prev => ({
      ...prev,
      links: [...prev.links, newLink]
    }));
    
    // Add to active links to prevent duplicates
    if (!activeLinks.includes(linkType)) {
      setActiveLinks([...activeLinks, linkType]);
    }
    
    return { success: true, linkType: linkInfo.name };
  };

  /**
   * Remove a link from the card
   * @param {number} linkId - ID of the link to remove
   */
  const removeLink = (linkId) => {
    const linkToRemove = formValues.links.find(link => link.id === linkId);
    if (!linkToRemove) return;
    
    // Remove link from form values
    const updatedLinks = formValues.links.filter(link => link.id !== linkId);
    setFormValues(prev => ({
      ...prev,
      links: updatedLinks
    }));
    
    // Update active links
    setActiveLinks(activeLinks.filter(type => type !== linkToRemove.type));
    
    return { success: true, linkType: linkToRemove.title };
  };

  /**
   * Update a link's value
   * @param {number} linkId - ID of the link to update
   * @param {string} value - New value for the link
   */
  const updateLinkValue = (linkId, value) => {
    // Update link in form values
    const updatedLinks = formValues.links.map(link => 
      link.id === linkId ? { ...link, value } : link
    );
    
    setFormValues(prev => ({
      ...prev,
      links: updatedLinks
    }));
  };

  /**
   * Update link properties
   * @param {number} linkId - ID of the link to update
   * @param {Object} newProps - New properties for the link
   */
  const updateLinkProps = (linkId, newProps) => {
    const updatedLinks = formValues.links.map(link => 
      link.id === linkId ? { ...link, ...newProps } : link
    );
    
    setFormValues(prev => ({
      ...prev,
      links: updatedLinks
    }));
  };

  /**
   * Reorder links
   * @param {number} sourceIndex - Original position
   * @param {number} destinationIndex - New position
   */
  const reorderLinks = (sourceIndex, destinationIndex) => {
    const links = [...formValues.links];
    const [movedItem] = links.splice(sourceIndex, 1);
    links.splice(destinationIndex, 0, movedItem);
    
    setFormValues(prev => ({
      ...prev,
      links
    }));
  };

  /**
   * Get all files for API submission
   * @returns {Object} Object containing all files
   */
  const getFiles = () => {
    return {
      avatarFile,
      backgroundFile,
      logoFile
    };
  };

  /**
   * Reset all form data to defaults
   */
  const resetForm = () => {
    setFormValues({
      ...defaultFormValues,
      imagePositions: {
        avatar: { crop: null, zoom: 1, position: { x: 0, y: 0 } },
        background: { crop: null, zoom: 1, position: { x: 0, y: 0 } },
        logo: { crop: null, zoom: 1, position: { x: 0, y: 0 } }
      }
    });
    setAvatarFile(null);
    setAvatarPreview(null);
    setBackgroundFile(null);
    setBackgroundPreview(null);
    setLogoFile(null);
    setLogoPreview(null);
    setActiveLinks([]);
    setImagePositions({
      avatar: { crop: null, zoom: 1, position: { x: 0, y: 0 } },
      background: { crop: null, zoom: 1, position: { x: 0, y: 0 } },
      logo: { crop: null, zoom: 1, position: { x: 0, y: 0 } }
    });
  };

  return {
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
    updateImagePosition,
    getFiles,
    resetForm,
  };
};