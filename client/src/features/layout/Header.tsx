import React from 'react';
import { GavelIcon, Scale, BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  language: string;
  setLanguage: (language: string) => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  return (
    <header className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="bg-white/10 p-2 rounded-lg mr-3 backdrop-blur-sm">
            <GavelIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Ugandan Legal Assistant</h1>
            <div className="flex items-center text-xs text-white/70 mt-1">
              <Scale className="h-3 w-3 mr-1" />
              <span>Powered by AI</span>
              <span className="mx-2">•</span>
              <BookOpen className="h-3 w-3 mr-1" />
              <span>Ugandan Law</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-white/10 text-white border-white/20 px-2 py-1">
            Beta
          </Badge>
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium">Language:</span>
            <Select
              value={language}
              onValueChange={setLanguage}
            >
              <SelectTrigger className="w-[140px] bg-white/10 text-white border-white/20 focus:ring-white/30">
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