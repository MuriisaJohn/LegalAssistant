import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Search, BookOpen } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { LegalContext } from '@shared/schema';

interface DocumentAnalyzerProps {
  document: LegalContext;
}

export default function DocumentAnalyzer({ document }: DocumentAnalyzerProps) {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  const analyzeMutation = useMutation({
    mutationFn: async (data: { question: string }) => {
      return apiRequest({
        url: `/api/documents/${document.id}/analyze`,
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: (data) => {
      setResponse(data.response);
    },
    onError: (error) => {
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Failed to analyze document. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast({
        title: 'Empty Question',
        description: 'Please enter a question to analyze.',
        variant: 'destructive',
      });
      return;
    }
    
    analyzeMutation.mutate({ question });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Document Analysis: {document.title}
        </CardTitle>
        <CardDescription>
          Ask questions about this document to get legal insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="question">Your Question</Label>
            <div className="flex w-full max-w-full items-center space-x-2">
              <Input
                id="question"
                placeholder="What rights are protected under this document?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <Button 
                type="submit" 
                disabled={!question.trim() || analyzeMutation.isPending}
              >
                <Search className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </div>
          </div>
          
          {analyzeMutation.isPending && (
            <div className="p-4 border rounded bg-muted animate-pulse">
              <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted-foreground/20 rounded w-5/6"></div>
            </div>
          )}
          
          {response && !analyzeMutation.isPending && (
            <div className="mt-4">
              <Label>Analysis Result</Label>
              <div className="p-4 border rounded bg-card mt-2">
                <div className="prose dark:prose-invert max-w-none">
                  {response.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}