import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LegalContext } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface LegalContextPanelProps {
  className?: string;
}

const LegalContextPanel: React.FC<LegalContextPanelProps> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: legalContexts = [], isLoading } = useQuery<LegalContext[]>({
    queryKey: ['/api/legal-contexts'],
  });

  // Filter legal contexts based on search term
  const filteredContexts = legalContexts.filter(context => 
    context.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    context.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-full bg-white p-4 rounded-lg shadow-sm ${className}`}>
      <h2 className="text-xl font-bold mb-4">Legal Context</h2>
      <p className="text-sm text-gray-500 mb-4">
        These are the legal documents that inform the AI's responses. The assistant will only provide information based on these documents.
      </p>
      
      {/* Search input */}
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search legal documents..."
          className="pl-8 pr-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Separator className="my-2" />
      
      {/* Legal context accordion */}
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredContexts.length > 0 ? (
        <div className="overflow-y-auto flex-1">
          <Accordion type="multiple" className="w-full">
            {filteredContexts.map((context) => (
              <AccordionItem key={context.id} value={context.id.toString()}>
                <AccordionTrigger className="text-left font-medium">
                  {context.title}
                </AccordionTrigger>
                <AccordionContent className="text-sm whitespace-pre-wrap">
                  {context.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        <div className="flex justify-center items-center h-32 text-gray-500">
          No legal documents found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default LegalContextPanel;