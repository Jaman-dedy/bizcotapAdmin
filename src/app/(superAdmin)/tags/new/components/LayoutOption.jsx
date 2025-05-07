// components/LayoutOption.js
import React from 'react';
import { CheckOutlined } from '@ant-design/icons';

const LayoutOption = ({ layout, selected, onClick }) => {
  return (
    <div 
      className={`group cursor-pointer ${selected ? 'active opacity-100' : 'opacity-50'}`}
      onClick={onClick}
    >
      <div 
        className={`${selected ? 'active shadow-[0px_4px_10px_0px_rgba(208,225,230,1.00)] !border-[#131518] !border-[2px]' : 'border-[1px] border-[#dbdde0]'} w-[127px] p-[5px] bg-white rounded-[14px] justify-start items-start gap-[3px] inline-flex overflow-hidden transition-all duration-200 relative`}
      >
        <img 
          src={`/images/cards/${layout.image}`} 
          alt={layout.name}
          className="rounded-xl h-[111px] w-[111px] object-cover"
        />
        {selected && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
            <CheckOutlined style={{ fontSize: '12px' }} />
          </div>
        )}
      </div>
      <div className={`text-[12px] w-full text-center mt-[8px] font-medium leading-[24px] ${selected ? 'text-[#131518] font-semibold' : 'text-[#6E7279]'}`}>
        {layout.name}
      </div>
    </div>
  );
};

export default LayoutOption;