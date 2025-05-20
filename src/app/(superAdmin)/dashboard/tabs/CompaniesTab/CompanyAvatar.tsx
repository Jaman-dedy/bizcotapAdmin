// components/dashboard/tabs/components/CompanyAvatar.tsx
import React from 'react';

interface CompanyAvatarProps {
  company: {
    name: string;
    logo?: string | null;
  };
  size?: 'small' | 'medium' | 'large';
}

const CompanyAvatar: React.FC<CompanyAvatarProps> = ({
  company,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'w-8 h-8 text-lg',
    medium: 'w-10 h-10 text-xl',
    large: 'w-16 h-16 text-3xl'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-purple-100 to-blue-50 rounded-lg flex items-center justify-center text-purple-600 overflow-hidden shadow-sm`}>
      {company.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={company.logo}
          alt={company.name}
          className="w-full h-full object-cover"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError={(e: any) => {
            e.currentTarget.onerror = null; // Prevent infinite loop
            e.currentTarget.style.display = 'none';
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            e.currentTarget.parentElement!.innerHTML = `<span class="${sizeClasses[size].split(' ')[2]} font-semibold">${company.name.charAt(0)}</span>`;
          }}
        />
      ) : (
        <span className={`${sizeClasses[size].split(' ')[2]} font-semibold`}>{company.name.charAt(0)}</span>
      )}
    </div>
  );
};

export default CompanyAvatar;
