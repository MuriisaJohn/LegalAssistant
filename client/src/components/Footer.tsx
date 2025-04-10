import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Footer() {
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} Ugandan Legal Assistant. Not a substitute for professional legal advice.
              </p>
            </div>
            <div className="flex space-x-4">
              <button 
                className="text-sm text-primary hover:underline"
                onClick={() => setShowAbout(true)}
              >
                About
              </button>
              <button 
                className="text-sm text-primary hover:underline"
                onClick={() => setShowPrivacy(true)}
              >
                Privacy
              </button>
              <button 
                className="text-sm text-primary hover:underline"
                onClick={() => setShowTerms(true)}
              >
                Terms
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* About Dialog */}
      <Dialog open={showAbout} onOpenChange={setShowAbout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About Ugandan Legal Assistant</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p className="mb-2">
              The Ugandan Legal Assistant is an AI-powered chatbot designed to provide information about Ugandan law.
            </p>
            <p className="mb-2">
              This tool uses advanced AI to analyze legal documents and respond to questions about Ugandan legal matters. It is intended for informational purposes only.
            </p>
            <p>
              While we strive for accuracy, the information provided should not be considered legal advice. Always consult with a qualified lawyer for specific legal matters.
            </p>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Privacy Dialog */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p className="mb-2">
              <strong>Data Collection:</strong> We collect conversation data to improve our service. Your API key is stored locally in your browser and is never sent to our servers.
            </p>
            <p className="mb-2">
              <strong>OpenAI Integration:</strong> Your conversations are processed through OpenAI's API using your provided API key. Please refer to OpenAI's privacy policy for information on how they handle data.
            </p>
            <p>
              <strong>Data Security:</strong> We implement reasonable security measures to protect your information, but no method of transmission over the Internet is 100% secure.
            </p>
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Terms Dialog */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <p className="mb-2">
              <strong>Not Legal Advice:</strong> The Ugandan Legal Assistant provides information about Ugandan law but does not constitute legal advice. Users should consult with qualified legal professionals for specific legal matters.
            </p>
            <p className="mb-2">
              <strong>Accuracy:</strong> While we strive for accuracy, we make no warranties about the completeness, reliability, or accuracy of the information provided.
            </p>
            <p>
              <strong>Usage:</strong> Users agree not to misuse this service for illegal purposes or to violate the rights of others.
            </p>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
}
