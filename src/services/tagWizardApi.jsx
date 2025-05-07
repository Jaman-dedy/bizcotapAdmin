// services/tagWizardApi.js
import axios from 'axios';

export class TagWizardAPI {
  static async checkPremiumStatus() {
    try {
      const response = await axios.get('/api/user/premium');
      return response.data;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return { isPremium: false };
    }
  }
  
  static async prepareFormData(formValues, files) {
    // Format data for API
    const tagData = {
      userId: parseInt(localStorage.getItem('userId')) || 1,
      tagInfo: {
        basicInfo: {
          firstName: formValues.basicInfo.firstName,
          lastName: formValues.basicInfo.lastName,
          company: formValues.basicInfo.company,
          position: formValues.basicInfo.position,
          location: formValues.basicInfo.location,
          bio: formValues.basicInfo.bio,
          buttonLabel: formValues.basicInfo.buttonLabel,
        },
        design: {
          cardLayout: formValues.design.cardLayout,
          headerStyle: formValues.design.headerStyle,
          cardBackground: formValues.design.cardBackground,
          headerBackground: formValues.design.headerBackground,
          linkBackground: formValues.design.linkBackground,
          cardText: formValues.design.cardText,
          linkText: formValues.design.linkText,
        },
        links: formValues.links.map(link => ({
          type: link.type,
          title: link.title,
          value: link.value,
          highlight: link.highlight || false,
          order: formValues.links.indexOf(link),
          // Additional fields based on link type
          ...(link.type === 'ADDRESS' && link.mapLink ? { mapLink: link.mapLink } : {}),
        })),
        leadCapture: {
          enabled: formValues.leadCapture.enabled,
          title: formValues.leadCapture.title,
          fields: formValues.leadCapture.fields,
          buttonText: formValues.leadCapture.buttonText,
          thankYouMessage: formValues.leadCapture.thankYouMessage,
        },
      }
    };
    
    // Create FormData object for file uploads
    const formData = new FormData();
    formData.append('data', JSON.stringify(tagData));
    
    // Add files if available
    if (files.avatarFile) {
      formData.append('avatar', files.avatarFile);
    }
    
    if (files.backgroundFile) {
      formData.append('background', files.backgroundFile);
    }
    
    if (files.logoFile) {
      formData.append('logo', files.logoFile);
    }
    
    return formData;
  }
  
  static async createDigitalCard(formData) {
    try {
      const response = await axios.post('/api/tags', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating digital card:', error);
      throw error;
    }
  }
  
  static async updateDigitalCard(tagId, formData) {
    try {
      const response = await axios.put(`/api/tags/${tagId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating digital card:', error);
      throw error;
    }
  }
  
  static async getDigitalCard(tagId) {
    try {
      const response = await axios.get(`/api/tags/${tagId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching digital card:', error);
      throw error;
    }
  }
}