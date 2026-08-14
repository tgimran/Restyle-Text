import React from 'react';
import logoSrc from '../assets/images/restyle_text_logo_1786683673519.jpg';

interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withGlow?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  withGlow = false,
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4 rounded-md',
    sm: 'w-5 h-5 rounded-lg',
    md: 'w-7 h-7 rounded-xl',
    lg: 'w-10 h-10 sm:w-11 sm:h-11 rounded-2xl',
    xl: 'w-16 h-16 rounded-3xl',
  };

  const imageSizeClasses = {
    xs: 'w-full h-full rounded-md',
    sm: 'w-full h-full rounded-lg',
    md: 'w-full h-full rounded-xl',
    lg: 'w-full h-full rounded-[15px]',
    xl: 'w-full h-full rounded-[22px]',
  };

  if (size === 'xs' || size === 'sm') {
    return (
      <span
        className={`inline-flex items-center justify-center shrink-0 overflow-hidden bg-black/90 border border-white/20 shadow-sm ${sizeClasses[size]} ${className}`}
      >
        <img
          src={logoSrc}
          alt="RT Crown Logo"
          referrerPolicy="no-referrer"
          className={`${imageSizeClasses[size]} object-cover select-none`}
        />
      </span>
    );
  }

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center ${
        withGlow
          ? 'bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/25'
          : 'border border-white/20 shadow-md'
      } bg-black/90 overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      <img
        src={logoSrc}
        alt="Restyle Text - RT Crown Monogram Logo"
        referrerPolicy="no-referrer"
        className={`${imageSizeClasses[size]} object-cover select-none`}
      />
    </div>
  );
};
