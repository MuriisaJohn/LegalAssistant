import React from 'react';
import { Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-4 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Ugandan Legal Assistant. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="text-gray-600 hover:text-primary text-sm flex items-center"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4 mr-1" />
              <span>Source Code</span>
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary text-sm"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary text-sm"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;