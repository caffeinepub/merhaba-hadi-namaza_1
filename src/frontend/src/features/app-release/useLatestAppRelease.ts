import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { AppRelease } from '../../backend';

/**
 * React Query hook to fetch the latest app release metadata from the backend.
 * 
 * Returns null/undefined gracefully if:
 * - No release is configured in the backend
 * - The fetch fails
 * - The actor is not yet available
 * 
 * This ensures the app continues to work normally even when release metadata is unavailable.
 */
export function useLatestAppRelease() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AppRelease | null>({
    queryKey: ['latestAppRelease'],
    queryFn: async () => {
      if (!actor) return null;
      
      try {
        const release = await actor.getLatestAppRelease();
        return release || null;
      } catch (error) {
        console.error('Failed to fetch latest app release:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
