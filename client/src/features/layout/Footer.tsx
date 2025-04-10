import React from 'react';
import { Github, Heart, Shield, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 py-6 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">About</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Ugandan Legal Assistant uses AI to provide accessible legal information based on Ugandan law. 
              Our goal is to make legal knowledge more accessible to all citizens.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary text-sm flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Legal Resources</span>
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary text-sm flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Data Protection Policy</span>
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact</h3>
            <p className="text-gray-600 text-sm">
              Have questions or need more specific legal advice?
              <br />
              <a href="#" className="text-primary hover:underline">Contact a legal professional</a>
            </p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm flex items-center">
              © {new Date().getFullYear()} Ugandan Legal Assistant. Made with 
              <Heart className="h-3 w-3 mx-1 text-red-500" fill="currentColor" /> 
              for justice.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-gray-600 hover:text-primary text-sm flex items-center transition-colors duration-200"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4 mr-1" />
              <span>Source</span>
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary text-sm transition-colors duration-200"
              rel="noopener noreferrer"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-primary text-sm transition-colors duration-200"
              rel="noopener noreferrer"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;