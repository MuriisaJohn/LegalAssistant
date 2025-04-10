import { Button } from "@/components/ui/button";

interface HeaderProps {
  language: string;
  onToggleLanguage: () => void;
}

export default function Header({ language, onToggleLanguage }: HeaderProps) {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 mr-2" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M14.5 3.5c4.8.3 8.5 4 8.5 8.6 0 4.8-4.1 8.7-9.1 8.9H6.5a9 9 0 0 1-9-9.3C-2.3 6.2 2.7 1 8.5.9h6Z"></path>
            <path d="M5.2 10h5.1a1 1 0 0 0 .7-1.7L8.5 5.7"></path>
            <path d="M9.7 13h5.1a1 1 0 0 1 .7 1.7l-2.5 2.6"></path>
          </svg>
          <h1 className="text-xl font-semibold">Ugandan Legal Assistant</h1>
        </div>
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-white text-white hover:bg-primary-600 transition flex items-center"
            onClick={onToggleLanguage}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 mr-1" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m5 8 6 6"></path>
              <path d="m4 14 6-6 2-3"></path>
              <path d="M2 5h12"></path>
              <path d="M7 2h1"></path>
              <path d="m22 22-5-10-5 10"></path>
              <path d="M14 18h6"></path>
            </svg>
            <span>{language}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
