import React from 'react';

export const LoadingSkeleton: React.FC<{ type?: 'card' | 'table' | 'text' }> = ({
  type = 'card',
}) => {
  if (type === 'table') {
    return (
      <div className="space-y-3 font-mono">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-[#111418] rounded border border-[#1E2631] animate-pulse" />
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return <div className="h-4 bg-[#111418] rounded animate-pulse w-3/4" />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-28 bg-[#111418] rounded-xl border border-[#1E2631] animate-pulse p-4 space-y-3">
          <div className="h-3 bg-[#1E2631] rounded w-1/2" />
          <div className="h-6 bg-[#1E2631] rounded w-3/4" />
        </div>
      ))}
    </div>
  );
};
