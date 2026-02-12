import React from 'react';
import { Button } from '../../components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '../../components/ui/button';

interface MotifButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  asChild?: boolean;
}

export function MotifButton({ children, className = '', variant, size, asChild, ...props }: MotifButtonProps) {
  return (
    <div className="relative inline-block">
      {/* Subtle tile pattern overlay */}
      <div className="absolute inset-0 rounded-md overflow-hidden opacity-10 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'url(/assets/generated/islamic-pattern-tile.dim_512x512.png)',
            backgroundSize: '32px 32px',
            backgroundRepeat: 'repeat'
          }}
        />
      </div>
      <Button className={`relative ${className}`} variant={variant} size={size} asChild={asChild} {...props}>
        {children}
      </Button>
    </div>
  );
}
