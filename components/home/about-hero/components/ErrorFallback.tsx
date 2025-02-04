import { memo } from 'react';

interface ErrorFallbackProps {
  error: Error;
}

export const ErrorFallback = memo(function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <div className="text-center p-4 bg-[#eaeadf] rounded-xl">
      <h2 className="text-[#6B5E4C] text-lg font-medium mb-2">
        Something went wrong
      </h2>
      <p className="text-[#8C7E6A] text-sm mb-4">
        {error.message}
      </p>
      <button
        onClick={() => window.location.reload()}
        aria-label="Retry loading collections"
        className="px-4 py-2 bg-[#6B5E4C] text-white rounded-lg
          hover:bg-[#8C7E6A] transition-colors duration-300"
      >
        Try again
      </button>
    </div>
  );
});

ErrorFallback.displayName = 'ErrorFallback';