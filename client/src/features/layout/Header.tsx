import React from 'react';
import { GavelIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeaderProps {
  language: string;
  setLanguage: (language: string) => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <GavelIcon className="h-8 w-8 mr-2" />
          <h1 className="text-xl font-bold">Ugandan Legal Assistant</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="mr-2 text-sm">Language:</span>
            <Select
              value={language}
              onValueChange={setLanguage}
            >
              <SelectTrigger className="w-[140px] bg-primary-dark text-white border-primary-dark">
                <SelectValue placeholder="English" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Swahili">Swahili</SelectItem>
                <SelectItem value="Luganda">Luganda</SelectItem>
                <SelectItem value="French">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;