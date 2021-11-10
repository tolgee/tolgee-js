import React from 'react';
import { LangSelector } from './LangSelector';

export const Navbar: React.FC = ({ children }) => {
  return (
    <div className="navbar">
      {children}
      <LangSelector />
    </div>
  );
};
