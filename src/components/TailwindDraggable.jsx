'use client';

import React, { useState } from 'react';

const TailwindDraggable = ({ items, renderItem, onReorder, dragHandleSelector = '.drag-handle' }) => {
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [dragOverItemIndex, setDragOverItemIndex] = useState(null);

  const handleDragStart = (e, index) => {
    // Only start drag if the target is the drag handle or a child of it
    const handleElement = e.target.closest(dragHandleSelector);
    if (!handleElement) {
      e.preventDefault();
      return;
    }
    
    setDraggedItemIndex(index);
    
    // Add a ghost image for better drag appearance
    const ghostElement = document.createElement('div');
    ghostElement.classList.add('opacity-0');
    document.body.appendChild(ghostElement);
    e.dataTransfer.setDragImage(ghostElement, 0, 0);
    document.body.removeChild(ghostElement);
    
    // Set needed data transfer properties
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
    
    // Add dragging class
    e.target.closest('.draggable-item').classList.add('opacity-60', 'bg-blue-50', 'border-blue-300');
  };

  const handleDragEnd = (e) => {
    document.querySelectorAll('.draggable-item').forEach(item => {
      item.classList.remove('opacity-60', 'bg-blue-50', 'border-blue-300', 'border-t-4', 'border-t-blue-500');
    });
    
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    
    if (index === draggedItemIndex) return;
    
    setDragOverItemIndex(index);
    
    // Update style for drop indicator
    document.querySelectorAll('.draggable-item').forEach(item => {
      item.classList.remove('border-t-4', 'border-t-blue-500');
    });
    
    const targetItem = e.currentTarget;
    const bounding = targetItem.getBoundingClientRect();
    const mouseY = e.clientY;
    const mousePosition = mouseY - bounding.top;
    const isInUpperHalf = mousePosition < bounding.height / 2;
    
    if (isInUpperHalf) {
      targetItem.classList.add('border-t-4', 'border-t-blue-500');
    } else {
      targetItem.nextElementSibling?.classList.add('border-t-4', 'border-t-blue-500');
    }
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    // Calculate whether to insert before or after based on mouse position
    const targetItem = e.currentTarget;
    const bounding = targetItem.getBoundingClientRect();
    const mouseY = e.clientY;
    const mousePosition = mouseY - bounding.top;
    const isInUpperHalf = mousePosition < bounding.height / 2;
    
    // Create new array with reordered items
    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedItemIndex, 1);
    
    // Insert at the proper position
    const insertAtIndex = isInUpperHalf 
      ? index > draggedItemIndex ? index - 1 : index 
      : index < draggedItemIndex ? index + 1 : index;
    
    newItems.splice(insertAtIndex, 0, draggedItem);
    
    // Call callback with reordered items
    onReorder(newItems);
    
    // Reset state
    setDraggedItemIndex(null);
    setDragOverItemIndex(null);
    
    // Remove indicator styles
    document.querySelectorAll('.draggable-item').forEach(item => {
      item.classList.remove('opacity-60', 'bg-blue-50', 'border-blue-300', 'border-t-4', 'border-t-blue-500');
    });
  };

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className="draggable-item border rounded-lg mb-4 transition-all duration-200 ease-in-out"
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={(e) => handleDrop(e, index)}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
};

export default TailwindDraggable;