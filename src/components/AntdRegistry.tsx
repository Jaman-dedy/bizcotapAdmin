'use client';
import React from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import type Entity from '@ant-design/cssinjs/es/Cache';
import { useServerInsertedHTML } from 'next/navigation';

/**
 * This registry component handles server-side rendering for Ant Design styles
 * and prevents style flashing during page transitions
 */
const AntdRegistry = ({ children }: { children: React.ReactNode }) => {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  
  useServerInsertedHTML(() => {
    const styleText = extractStyle(cache);
    return <style id="antd" dangerouslySetInnerHTML={{ __html: styleText }} />;
  });
  
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default AntdRegistry;