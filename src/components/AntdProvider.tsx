'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { ConfigProvider, App } from 'antd';
import { StyleProvider, legacyLogicalPropertiesTransformer } from '@ant-design/cssinjs';

// Define the theme configuration
const themeConfig = {
  token: {
    colorPrimary: '#4F46E5', // Match your brand color
    borderRadius: 6,
  },
  components: {
    Button: {
      colorPrimary: '#4F46E5',
    },
    Table: {
      colorBgContainer: '#ffffff',
      fontWeightStrong: 500,
    },
  },
};

interface AntdProviderProps {
  children: ReactNode;
}

export default function AntdProvider({ children }: AntdProviderProps) {
  return (
    <StyleProvider transformers={[legacyLogicalPropertiesTransformer]}>
      <ConfigProvider
        theme={themeConfig}
      >
        <App>{children}</App>
      </ConfigProvider>
    </StyleProvider>
  );
}