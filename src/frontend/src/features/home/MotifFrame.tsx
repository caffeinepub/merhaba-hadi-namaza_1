import React from 'react';

interface MotifFrameProps {
  children: React.ReactNode;
  variant?: 'default' | 'ornamental' | 'divider';
  className?: string;
}

export function MotifFrame({ children, variant = 'default', className = '' }: MotifFrameProps) {
  if (variant === 'ornamental') {
    return (
      <div className={`relative ${className}`}>
        {/* Corner ornaments */}
        <div className="absolute -top-3 -left-3 w-12 h-12 opacity-30 pointer-events-none">
          <img
            src="/assets/generated/islamic-corner-ornament.dim_512x512.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute -top-3 -right-3 w-12 h-12 opacity-30 pointer-events-none rotate-90">
          <img
            src="/assets/generated/islamic-corner-ornament.dim_512x512.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute -bottom-3 -left-3 w-12 h-12 opacity-30 pointer-events-none -rotate-90">
          <img
            src="/assets/generated/islamic-corner-ornament.dim_512x512.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute -bottom-3 -right-3 w-12 h-12 opacity-30 pointer-events-none rotate-180">
          <img
            src="/assets/generated/islamic-corner-ornament.dim_512x512.png"
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        {children}
      </div>
    );
  }

  if (variant === 'divider') {
    return (
      <div className={`space-y-4 ${className}`}>
        {children}
        <div className="w-full h-8 opacity-20 flex items-center justify-center">
          <img
            src="/assets/generated/islamic-divider-flourish.dim_1200x200.png"
            alt=""
            className="h-full w-auto object-contain"
          />
        </div>
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}
