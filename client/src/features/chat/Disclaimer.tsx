import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-amber-700">
            <strong>Disclaimer:</strong> This AI assistant provides general legal information based on Ugandan law, not personalized legal advice. Always consult with a qualified attorney for your specific situation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;