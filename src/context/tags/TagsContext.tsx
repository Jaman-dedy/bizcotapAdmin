'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Tag } from '@/services/tagsService';

interface TagsContextProps {
  currentTag: Tag | null;
  setCurrentTag: (tag: Tag | null) => void;
  tagsCache: Map<string, Tag>;
  addToCache: (tag: Tag) => void;
  getFromCache: (id: string) => Tag | undefined;
  clearCache: () => void;
}

const TagsContext = createContext<TagsContextProps | undefined>(undefined);

export const TagsProvider = ({ children }: { children: ReactNode }) => {
  const [currentTag, setCurrentTag] = useState<Tag | null>(null);
  const [tagsCache, setTagsCache] = useState<Map<string, Tag>>(new Map());

  const addToCache = (tag: Tag) => {
    setTagsCache(prev => {
      const newCache = new Map(prev);
      newCache.set(tag.id, tag);
      return newCache;
    });
  };

  const getFromCache = (id: string) => {
    return tagsCache.get(id);
  };

  const clearCache = () => {
    setTagsCache(new Map());
  };

  return (
    <TagsContext.Provider value={{
      currentTag,
      setCurrentTag,
      tagsCache,
      addToCache,
      getFromCache,
      clearCache
    }}>
      {children}
    </TagsContext.Provider>
  );
};

export const useTagsContext = () => {
  const context = useContext(TagsContext);
  if (context === undefined) {
    throw new Error('useTagsContext must be used within a TagsProvider');
  }
  return context;
};
