import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { LegalContext } from '@/types';

const ContextPanel: React.FC = () => {
  const { data: legalContexts, isLoading, error } = useQuery<LegalContext[]>({
    queryKey: ['/api/legal-contexts'],
  });

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
      <div className="p-4 bg-[#155E75] text-white font-medium">
        Legal Context
      </div>
      <div className="p-4 max-h-[calc(100vh-14rem)] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-9/12" />
          </div>
        ) : error ? (
          <div className="text-sm text-red-500">
            Failed to load legal context information.
          </div>
        ) : legalContexts && legalContexts.length > 0 ? (
          <div className="text-sm font-serif space-y-3 text-neutral-800">
            {legalContexts.map((context, index) => (
              <p key={index}>
                <strong>{context.title}: </strong>
                {context.content}
              </p>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            No legal context information available.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContextPanel;
