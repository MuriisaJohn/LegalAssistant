import React, { useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { LegalContext } from '@/types';
import { FileText, Search, Calendar, Upload, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface LegalContextPanelProps {
  className?: string;
}

const LegalContextPanel: React.FC<LegalContextPanelProps> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { data: legalContexts = [], isLoading } = useQuery<LegalContext[]>({
    queryKey: ['/api/legal-contexts'],
  });

  // Document upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload document');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Document uploaded successfully",
        description: "Your document has been uploaded and processed for analysis.",
        variant: "default",
      });
      // Refresh the documents list
      queryClient.invalidateQueries({ queryKey: ['/api/legal-contexts'] });
      setIsUploading(false);
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  });

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type and size
    const validTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, TXT, DOC, or DOCX file.",
        variant: "destructive",
      });
      return;
    }
    
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }
    
    // Upload the file
    setIsUploading(true);
    const formData = new FormData();
    formData.append('document', file);
    uploadMutation.mutate(formData);
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Filter legal contexts based on search term
  const filteredContexts = legalContexts.filter(context => 
    context.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    context.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-serif font-medium">Your Documents</h3>
        <Button
          size="sm"
          onClick={handleUploadClick}
          className="bg-[#14284b] hover:bg-[#0f203a] text-white text-xs py-1 h-auto"
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="flex items-center">
              <div className="animate-spin h-3 w-3 border-2 border-t-transparent border-white rounded-full mr-1" />
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Upload className="h-3 w-3 mr-1" />
              <span>Upload Document</span>
            </div>
          )}
        </Button>
        <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.txt,.doc,.docx,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
        />
      </div>
      
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
          ) : searchTerm ? (
            <div className="text-center text-gray-500 p-6 bg-gray-50 rounded-md">
              <p>No documents found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-md border border-dashed border-gray-300 text-center">
              <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                <Plus className="h-6 w-6 text-[#14284b]" />
              </div>
              <h4 className="text-base font-medium text-gray-700 mb-2">No documents yet</h4>
              <p className="text-sm text-gray-500 mb-4">Upload legal documents for AI analysis and advice</p>
              <Button
                onClick={handleUploadClick}
                className="bg-[#14284b] hover:bg-[#0f203a] text-white text-xs"
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-3 w-3 border-2 border-t-transparent border-white rounded-full mr-1" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Upload className="h-3 w-3 mr-1" />
                    <span>Upload Document</span>
                  </div>
                )}
              </Button>
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