import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import type { SermonData } from '../../backend';

export function useLatestSermon() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  const query = useQuery<SermonData>({
    queryKey: ['latestSermon'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLatestCachedSermon();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.refreshAndGetLatestSermon();
    },
    onSuccess: (freshSermon) => {
      queryClient.setQueryData(['latestSermon'], freshSermon);
    },
  });

  return {
    ...query,
    refresh: refreshMutation.mutateAsync,
    isRefreshing: refreshMutation.isPending,
  };
}
