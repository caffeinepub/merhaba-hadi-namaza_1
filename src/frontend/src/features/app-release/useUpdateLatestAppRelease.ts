import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { AppRelease } from '../../backend';

/**
 * React Query mutation hook to update the latest app release metadata.
 * 
 * On success:
 * - Invalidates and refetches the latest release query
 * - UI reflects changes immediately without hard refresh
 * 
 * Backend enforces admin-only access; non-admin calls will fail.
 */
export function useUpdateLatestAppRelease() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (release: AppRelease) => {
      if (!actor) {
        throw new Error('Actor not available');
      }
      
      await actor.updateLatestAppRelease(release);
    },
    onSuccess: () => {
      // Invalidate and refetch the latest release query
      queryClient.invalidateQueries({ queryKey: ['latestAppRelease'] });
    },
  });
}
