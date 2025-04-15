import React from 'react';
import { GavelIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface HeaderProps {
  language: string;
  setLanguage: (language: string) => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="text-primary">
            <GavelIcon className="h-6 w-6" />
          </div>
          <Link href="/" className="text-xl font-serif font-semibold text-primary hover:text-[#0f203a]">
            LegalAI
          </Link>
        </div>
        
        <div className="flex items-center space-x-4 md:space-x-6">
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-primary font-medium">
              Documents
            </Link>
            <Link href="/chat" className="text-gray-600 hover:text-primary font-medium">
              Chat
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary font-medium">
              About
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            <Select
              value={language}
              onValueChange={setLanguage}
            >
              <SelectTrigger className="w-[100px] bg-white border-gray-200">
                <SelectValue placeholder="English" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Swahili">Swahili</SelectItem>
                <SelectItem value="Luganda">Luganda</SelectItem>
                <SelectItem value="French">French</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="bg-white border-gray-300 text-gray-700">
              Login
            </Button>
            
            <Button className="bg-[#14284b] hover:bg-[#0f203a] text-white">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;