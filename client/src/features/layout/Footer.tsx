import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-5 border-t border-gray-200">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} LegalAI. All rights reserved.
            </p>
          </div>
          <div className="flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-600 hover:text-[#14284b] text-sm transition-colors duration-200"
              rel="noopener noreferrer"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-[#14284b] text-sm transition-colors duration-200"
              rel="noopener noreferrer"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-[#14284b] text-sm transition-colors duration-200"
              rel="noopener noreferrer"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;