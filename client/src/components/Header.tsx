import React from 'react';
import { Scale } from 'lucide-react';

interface HeaderProps {
  language: string;
}

const Header: React.FC<HeaderProps> = ({ language }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Scale className="h-8 w-8 text-primary" />
          <h1 className="ml-2 text-xl font-semibold text-neutral-900">Ugandan Legal Assistant</h1>
        </div>
        <div className="text-sm bg-[#0891B2] text-white px-3 py-1 rounded-full">
          {language}
        </div>
      </div>
    </header>
  );
};

export default Header;
