export default function Disclaimer() {
  return (
    <div className="bg-secondary bg-opacity-10 rounded-lg p-4 mb-4">
      <h2 className="font-semibold text-secondary flex items-center">
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
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        Disclaimer
      </h2>
      <p className="text-sm text-secondary">
        This is an AI assistant that provides information about Ugandan law based on available documents. 
        The information provided should not be considered legal advice. Always consult with a qualified lawyer for legal matters.
      </p>
    </div>
  );
}
