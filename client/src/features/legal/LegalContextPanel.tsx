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
import { Search, BookOpen, Info, FileText, ScrollText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
    <div className={`flex flex-col h-full bg-white rounded-lg shadow-md border border-gray-100 ${className}`}>
      <div className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg border-b border-gray-100">
        <div className="flex items-center mb-2">
          <BookOpen className="h-5 w-5 text-primary mr-2" />
          <h2 className="text-lg font-bold">Legal Reference Library</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          These legal documents provide the foundation for AI responses. References to specific articles will be included when answering your questions.
        </p>
      </div>
      
      {/* Search input */}
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search legal references..."
            className="pl-9 pr-4 py-2 bg-gray-50 border-gray-200 focus-visible:ring-primary/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary cursor-pointer">
            Constitution
          </Badge>
          <Badge variant="outline" className="bg-gray-100 hover:bg-gray-200 border-gray-200 cursor-pointer">
            Criminal Law
          </Badge>
          <Badge variant="outline" className="bg-gray-100 hover:bg-gray-200 border-gray-200 cursor-pointer">
            Civil Law
          </Badge>
        </div>
      
        <Separator className="my-2" />
      </div>
      
      {/* Legal context accordion */}
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredContexts.length > 0 ? (
        <div className="overflow-y-auto flex-1 px-4 pb-4">
          <Accordion type="multiple" className="w-full">
            {filteredContexts.map((context) => (
              <AccordionItem key={context.id} value={context.id.toString()} className="border-b border-gray-100">
                <AccordionTrigger className="text-left font-medium py-3 hover:bg-gray-50 hover:no-underline rounded px-2 group">
                  <div className="flex items-center">
                    {context.title.includes("Constitution") ? (
                      <ScrollText className="h-4 w-4 mr-2 text-primary" />
                    ) : (
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    )}
                    <span className="group-hover:text-primary transition-colors">{context.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-100 mt-1 mb-2">
                    <div className="text-sm whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {context.content}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-32 text-gray-500 p-4">
          <Info className="h-5 w-5 mb-2" />
          <p>No legal documents found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default LegalContextPanel;