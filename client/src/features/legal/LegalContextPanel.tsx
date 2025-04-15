import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LegalContext } from '@/types';
import { FileText, Search, Calendar, Plus, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { queryClient } from '@/lib/queryClient';
import DocumentUpload from '../documents/DocumentUpload';

interface LegalContextPanelProps {
  className?: string;
}

const LegalContextPanel: React.FC<LegalContextPanelProps> = ({ className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: legalContexts = [], isLoading } = useQuery<LegalContext[]>({
    queryKey: ['/api/legal-contexts'],
  });

  // Filter legal contexts based on search term
  const filteredContexts = legalContexts.filter(context => 
    context.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    context.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // TODO: Implement file upload logic here
      // You can use your DocumentUpload component or implement the upload logic
      console.log('File selected:', file);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[#14284b]">Legal Documents</h3>
        <Button
          variant="outline"
          size="sm"
          className="bg-white border-gray-300 text-gray-700"
          onClick={() => setUploadDialogOpen(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-50 border-gray-200"
        />
      </div>

      <Tabs defaultValue="all" className="flex-1">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14284b]"></div>
            </div>
          ) : filteredContexts.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No documents found
            </div>
          ) : (
            filteredContexts.map((context) => (
              <div
                key={context.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <FileText className="h-5 w-5 text-[#14284b] mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {context.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {context.content.substring(0, 50)}...
                  </p>
                </div>
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <DocumentUpload />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LegalContextPanel;