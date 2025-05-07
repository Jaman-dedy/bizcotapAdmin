// components/SortableLinksList.js
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Typography } from 'antd';
import ModernLinkItem from './LinkItem';

const { Text } = Typography;

// Sortable item wrapper component
const SortableItem = ({ link, onRemove, onEdit, theme }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    margin: '8px 0',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ModernLinkItem
        link={link}
        onRemove={onRemove}
        onEdit={onEdit}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
        theme={theme}
      />
    </div>
  );
};

const SortableLinksList = ({ 
  links, 
  onRemove, 
  onEdit, 
  onReorder,
  theme = {
    linkBackground: '#ffffff',
    linkText: '#000000',
    linkIconColor: '#1890ff'
  }
}) => {
  const [activeId, setActiveId] = useState(null);
  
  // Find current active link
  const activeLink = activeId ? links.find(link => link.id === activeId) : null;
  
  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Find the indexes
      const oldIndex = links.findIndex(link => link.id === active.id);
      const newIndex = links.findIndex(link => link.id === over.id);
      
      // Call handler to update the order
      onReorder(oldIndex, newIndex);
    }
    
    setActiveId(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {links.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <div className="mb-4">
            <img 
              src="/images/icons/link.svg" 
              alt="Link" 
              className="w-6 h-6 mx-auto opacity-50" 
            />
          </div>
          <Text type="secondary">
            No links added yet. Click "Add Section" to add your first link.
          </Text>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={links.map(link => link.id)}
            strategy={verticalListSortingStrategy}
          >
            {links.map((link) => (
              <SortableItem
                key={link.id}
                link={link}
                onRemove={onRemove}
                onEdit={onEdit}
                theme={theme}
              />
            ))}
          </SortableContext>
          
          <DragOverlay>
            {activeId && activeLink ? (
              <ModernLinkItem 
                link={activeLink} 
                onRemove={() => {}} 
                onEdit={() => {}} 
                isDragging={true}
                theme={theme}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default SortableLinksList;