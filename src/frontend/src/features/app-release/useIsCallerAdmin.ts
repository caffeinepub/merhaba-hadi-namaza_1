import { useQuery } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';

/**
 * React Query hook to check if the current caller is an admin.
 * 
 * Uses the authorization component's role-based access control
 * to determine whether to show/enable admin-only controls.
 * 
 * Returns false by default when actor is unavailable or check fails.
 */
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Failed to check admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
