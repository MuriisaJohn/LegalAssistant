import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload document');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Document Uploaded',
        description: `${data.document.title} has been successfully uploaded and is ready for analysis.`,
      });
      setFile(null);
      // Clear the file input
      const fileInput = document.getElementById('document') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Refresh the documents list
      window.location.reload();
    },
    onError: (error) => {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to upload document. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: 'No File Selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Maximum file size is 10MB. Please select a smaller file.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check file type
    const allowedTypes = [
      'application/pdf', 
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a PDF, TXT, DOC, or DOCX file.',
        variant: 'destructive',
      });
      return;
    }
    
    const formData = new FormData();
    formData.append('document', file);
    
    uploadMutation.mutate(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Upload Legal Document</CardTitle>
        <CardDescription>
          Upload your legal document for AI-powered analysis and advice
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="document">Document</Label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="document"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {file ? (
                      <>
                        <FileText className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">{file.name}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, TXT, DOC, DOCX (MAX. 10MB)
                        </p>
                      </>
                    )}
                  </div>
                  <Input
                    id="document"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.txt,.doc,.docx,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                </label>
              </div>
            </div>
            {!file && (
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-2">
                <AlertCircle className="h-4 w-4 mr-1" />
                Upload a document to get legal advice specific to its content
              </p>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!file || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Upload Document'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}