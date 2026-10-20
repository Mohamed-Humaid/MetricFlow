import React, { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '../../utilities/formatters';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 shadow-xl transition-all duration-200 backdrop-blur-md',
        glow && 'hover:border-cyan-500/40 hover:shadow-cyan-500/5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
