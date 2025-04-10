import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LegalContext } from '@/types';
import { FileText, Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    <div className={`flex flex-col h-full ${className}`}>
      <h3 className="text-lg font-serif font-medium mb-3">Your Documents</h3>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search documents..."
          className="pl-9 pr-4 py-2 bg-white border-gray-200 focus-visible:ring-primary/30 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="bg-gray-100">
          <TabsTrigger 
            value="all" 
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-primary"
          >
            All Documents
          </TabsTrigger>
          <TabsTrigger 
            value="starred" 
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-primary"
          >
            Starred
          </TabsTrigger>
          <TabsTrigger 
            value="recent" 
            className="text-xs data-[state=active]:bg-white data-[state=active]:text-primary"
          >
            Recent
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : filteredContexts.length > 0 ? (
            <div className="space-y-3">
              {filteredContexts.map((context) => (
                <div 
                  key={context.id} 
                  className="bg-white p-3 rounded-md border border-gray-200 hover:border-primary/30 hover:shadow-sm transition-colors cursor-pointer"
                >
                  <div className="flex items-start mb-1">
                    <div className="flex-shrink-0 mr-3 mt-1">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">{context.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="uppercase">PDF</span>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>April 10, 2025</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 p-6 bg-gray-50 rounded-md">
              <p>No documents found matching "{searchTerm}"</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="starred">
          <div className="text-center text-gray-500 p-6 bg-gray-50 rounded-md">
            <p>No starred documents</p>
          </div>
        </TabsContent>
        
        <TabsContent value="recent">
          <div className="text-center text-gray-500 p-6 bg-gray-50 rounded-md">
            <p>No recent documents</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalContextPanel;