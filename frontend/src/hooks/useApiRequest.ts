import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseApiRequestOptions {
  onForbidden?: () => void;
  redirectOnForbidden?: boolean;
}

export function useApiRequest<T>(options: UseApiRequestOptions = {}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState(false);

  const execute = async (apiCall: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);
    setIsForbidden(false);

    try {
      const result = await apiCall();
      return result;
    } catch (err: any) {
      if (err.response?.status === 403) {
        setIsForbidden(true);
        
        if (options.onForbidden) {
          options.onForbidden();
        } else if (options.redirectOnForbidden !== false) {
          router.push('/forbidden');
        }
      }
      
      const message = err.response?.data?.message || 'Error en la petición';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    execute,
    isLoading,
    error,
    isForbidden,
  };
}
