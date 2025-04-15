import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

interface LegalDocument {
  id: string;
  title: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: 'processing' | 'ready' | 'error';
}

interface ApiResponse {
  documents: LegalDocument[];
}

export default function DocumentList() {
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const queryClient = useQueryClient();
  
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/documents');
      const data = await response.json() as ApiResponse;
      return data.documents;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const response = await apiRequest('DELETE', `/api/documents/${documentId}`);
      return response;
    },
    onSuccess: () => {
      toast({
        title: 'Document Deleted',
        description: 'The document has been successfully deleted.',
      });
      // Invalidate and refetch the documents query
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete document. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (doc: LegalDocument) => {
    setSelectedDocument(doc);
    // Show confirmation dialog
    if (window.confirm(`Are you sure you want to delete ${doc.title}?`)) {
      deleteMutation.mutate(doc.id);
    }
  };

  const handleDownload = async (doc: LegalDocument) => {
    try {
      const response = await fetch(`/api/documents/${doc.id}/download`);
      if (!response.ok) throw new Error('Failed to download document');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: error instanceof Error ? error.message : 'Failed to download document. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-[#14284b] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-500">Failed to load documents. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!documents?.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No documents uploaded yet</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Documents</CardTitle>
        <CardDescription>
          View and manage your uploaded legal documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((document) => (
            <div
              key={document.id}
              className="flex items-center p-4 bg-white border rounded-lg hover:bg-gray-50"
            >
              <FileText className="h-5 w-5 text-[#14284b] mr-3" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {document.title}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>{document.type}</span>
                  <span className="mx-2">•</span>
                  <span>{(document.size / 1024 / 1024).toFixed(2)} MB</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(document.uploadedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {document.status === 'processing' && (
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="animate-spin h-3 w-3 border-2 border-[#14284b] border-t-transparent rounded-full mr-1" />
                    Processing
                  </div>
                )}
                {document.status === 'error' && (
                  <div className="flex items-center text-xs text-red-500">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Error
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(document)}
                  className="text-gray-500 hover:text-[#14284b]"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(document)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 