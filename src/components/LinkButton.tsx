import React from 'react';

interface LinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function LinkButton({ children, ...props }: LinkButtonProps) {
  return (
    <button type="button" className="linkComponent" {...props}>
      {children}
    </button>
  );
}
