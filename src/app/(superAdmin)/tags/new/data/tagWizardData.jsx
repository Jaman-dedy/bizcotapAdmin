// tagWizardData.js
import {
  SettingOutlined,
  LinkOutlined,
  FormOutlined,
} from '@ant-design/icons';

// Link categories with custom SVG icons for the modal UI
export const linkCategories = [
  {
    name: 'Recommended',
    key: 'recommended',
    links: [
      { icon: '/images/icons/call.svg', name: 'Call', type: 'PHONE', placeholder: '+1 (123) 456-7890' },
      { icon: '/images/icons/email.svg', name: 'Email', type: 'EMAIL', placeholder: 'email@example.com' },
      { icon: '/images/icons/safari.svg', name: 'Website', type: 'WEBSITE', placeholder: 'https://' },
      { icon: '/images/icons/address.svg', name: 'Address', type: 'ADDRESS', placeholder: 'Your address' },
      { icon: '/images/icons/linkedin.svg', name: 'LinkedIn', type: 'LINKEDIN', placeholder: 'https://linkedin.com/in/' },
      { icon: '/images/icons/whatsapp.svg', name: 'WhatsApp', type: 'WHATSAPP', placeholder: '+1 (123) 456-7890' },
      { icon: '/images/icons/file-image.svg', name: 'Photo Gallery', type: 'PHOTOS', placeholder: 'Photo Gallery' },
      { icon: '/images/icons/file-video.svg', name: 'Videos Gallery', type: 'VIDEOS', placeholder: 'Videos Gallery' }
    ]
  },
  {
    name: 'Social Platforms',
    key: 'social',
    links: [
      { icon: '/images/icons/instagram.svg', name: 'Instagram', type: 'INSTAGRAM', placeholder: 'https://instagram.com/' },
      { icon: '/images/icons/facebook.svg', name: 'Facebook', type: 'FACEBOOK', placeholder: 'https://facebook.com/' },
      { icon: '/images/icons/twitter.svg', name: 'X', type: 'TWITTER', placeholder: 'https://x.com/' },
      { icon: '/images/icons/linkedin.svg', name: 'LinkedIn', type: 'LINKEDIN', placeholder: 'https://linkedin.com/in/' },
      { icon: '/images/icons/tiktok.svg', name: 'TikTok', type: 'TIKTOK', placeholder: 'https://tiktok.com/@' },
      { icon: '/images/icons/snapchat.svg', name: 'SnapChat', type: 'SNAPCHAT', placeholder: 'https://snapchat.com/add/' }
    ]
  },
  {
    name: 'Video',
    key: 'video',
    links: [
      { icon: '/images/icons/youtube.svg', name: 'YouTube', type: 'YOUTUBE', placeholder: 'https://youtube.com/' },
      { icon: '/images/icons/vimeo.png', name: 'Vimeo', type: 'VIMEO', placeholder: 'https://vimeo.com/' },
      { icon: '/images/icons/twitch.svg', name: 'Twitch', type: 'TWITCH', placeholder: 'https://twitch.tv/' },
      { icon: '/images/icons/tiktok.svg', name: 'TikTok', type: 'TIKTOK', placeholder: 'https://tiktok.com/@' }
    ]
  },
  {
    name: 'Other',
    key: 'other',
    links: [
      { icon: '/images/icons/telegram.svg', name: 'Telegram', type: 'TELEGRAM', placeholder: 'https://t.me/' },
      { icon: '/images/icons/wechat.svg', name: 'WeChat', type: 'WECHAT', placeholder: 'WeChat ID' },
      { icon: '/images/icons/calendly.png', name: 'Calendly', type: 'CALENDLY', placeholder: 'https://calendly.com/' },
      { icon: '/images/icons/pinterest.svg', name: 'Pinterest', type: 'PINTEREST', placeholder: 'https://pinterest.com/' },
      { icon: '/images/icons/onlyfans.png', name: 'OnlyFans', type: 'ONLYFANS', placeholder: 'https://onlyfans.com/' }
    ]
  }
];

// Additional fields and settings for specific link types
export const linkTypeForms = {
  PHONE: {
    fields: [
      { name: 'value', label: 'Phone Number', type: 'input', required: true },
      { name: 'title', label: 'Label (optional)', type: 'input', required: false, defaultValue: 'Call' },
      { name: 'highlight', label: 'Highlight this link', type: 'switch', defaultValue: false }
    ]
  },
  WHATSAPP: {
    fields: [
      { name: 'value', label: 'WhatsApp Number', type: 'input', required: true },
      { name: 'title', label: 'Label (optional)', type: 'input', required: false, defaultValue: 'WhatsApp' },
      { name: 'highlight', label: 'Highlight this link', type: 'switch', defaultValue: false }
    ]
  },
  EMAIL: {
    fields: [
      { name: 'value', label: 'Email Address', type: 'input', required: true },
      { name: 'title', label: 'Label (optional)', type: 'input', required: false, defaultValue: 'Email' },
      { name: 'highlight', label: 'Highlight this link', type: 'switch', defaultValue: false }
    ]
  },
  WEBSITE: {
    fields: [
      { name: 'value', label: 'Website URL', type: 'input', required: true },
      { name: 'title', label: 'Label (optional)', type: 'input', required: false, defaultValue: 'Website' },
      { name: 'highlight', label: 'Highlight this link', type: 'switch', defaultValue: false }
    ]
  },
  ADDRESS: {
    fields: [
      { name: 'value', label: 'Address', type: 'textarea', required: true },
      { name: 'title', label: 'Label (optional)', type: 'input', required: false, defaultValue: 'Address' },
      { name: 'mapLink', label: 'Google Maps Link (optional)', type: 'input', required: false },
      { name: 'highlight', label: 'Highlight this link', type: 'switch', defaultValue: false }
    ]
  },
  INSTAGRAM: {
    fields: [
      { name: 'value', label: 'Instagram URL or Username', type: 'input', required: true },
      { name: 'title', label: 'Label (optional)', type: 'input', required: false, defaultValue: 'Instagram' },
      { name: 'highlight', label: 'Highlight this link', type: 'switch', defaultValue: false }
    ]
  },
  // Default form for other types
  DEFAULT: {
    fields: [
      { name: 'value', label: 'Link URL or Value', type: 'input', required: true },
      { name: 'title', label: 'Label (optional)', type: 'input', required: false },
      { name: 'highlight', label: 'Highlight this link', type: 'switch', defaultValue: false }
    ]
  }
};

// Color options for pickers
export const colorOptions = [
  '#000000', '#ff4d4f', '#fa541c', '#faad14', '#52c41a', 
  '#13c2c2', '#1890ff', '#722ed1', '#eb2f96', '#f5f5f5', '#ffffff'
];

// Card layouts
export const cardLayouts = [
  { 
    name: "Profile Picture",
    value: 'standard', 
    image: "cardType1.png",
    description: 'Profile image only with content below'
  },
  { 
    name: "Cover + Profile Picture",
    value: 'modern', 
    image: "cardType2.png",
    description: 'Cover photo with profile picture'
  }
];

// Define step content
export const steps = [
  {
    title: 'Design',
    icon: <SettingOutlined />,
    description: 'Choose layout & colors'
  },
  {
    title: 'Links & Contact',
    icon: <LinkOutlined />,
    description: 'Add links & contact info'
  },
  {
    title: 'Lead Capture',
    icon: <FormOutlined />,
    description: 'Lead form settings'
  }
];

// Default form values
export const defaultFormValues = {
  // Design options
  design: {
    cardLayout: 'standard',
    headerStyle: 'background_image',
    cardBackground: '#ffffff',
    headerBackground: '#004b93',
    linkBackground: '#f5f5f5',
    cardText: '#333333',
    linkText: '#004b93',
  },
  // Basic info
  basicInfo: {
    firstName: '',
    lastName: '',
    company: '',
    position: '',
    location: '',
    bio: '',
    buttonLabel: 'Save Contact',
  },
  // Links
  links: [],
  // Lead capture
  leadCapture: {
    enabled: false,
    title: 'Contact Me',
    fields: {
      name: true,
      email: true,
      phone: false,
      company: false,
      message: false
    },
    buttonText: 'Submit',
    thankYouMessage: 'Thank you for your message. I will get back to you soon!'
  }
};