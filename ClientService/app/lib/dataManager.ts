import { QueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash-es';

// Enhanced QueryClient with enterprise configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (was cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors (client errors)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        console.error('Mutation error:', error);
        // Here you could dispatch to notification store
      },
    },
  },
});

// Cache management utilities
export class CacheManager {
  private static queryClient = queryClient;

  static invalidateQueries(queryKey: string[]) {
    return this.queryClient.invalidateQueries({ queryKey });
  }

  static prefetchQuery(queryKey: string[], queryFn: () => Promise<any>) {
    return this.queryClient.prefetchQuery({
      queryKey,
      queryFn,
    });
  }

  static setQueryData(queryKey: string[], data: any) {
    this.queryClient.setQueryData(queryKey, data);
  }

  static getQueryData(queryKey: string[]) {
    return this.queryClient.getQueryData(queryKey);
  }

  static removeQueries(queryKey: string[]) {
    this.queryClient.removeQueries({ queryKey });
  }

  static clear() {
    this.queryClient.clear();
  }

  // Smart invalidation patterns
  static invalidateUserData(userId?: string) {
    if (userId) {
      this.invalidateQueries(['user', userId]);
      this.invalidateQueries(['user-preferences', userId]);
    } else {
      this.invalidateQueries(['user']);
    }
  }

  static invalidateModuleData(module: string) {
    this.invalidateQueries([module]);
  }
}

// Optimistic updates helper
export class OptimisticUpdates {
  private static queryClient = queryClient;

  static async updateWithOptimism<T>(
    queryKey: string[],
    updateFn: (oldData: T) => T,
    mutationFn: () => Promise<T>
  ) {
    // Cancel any outgoing refetches
    await this.queryClient.cancelQueries({ queryKey });

    // Snapshot the previous value
    const previousData = this.queryClient.getQueryData<T>(queryKey);

    // Optimistically update to the new value
    if (previousData) {
      this.queryClient.setQueryData(queryKey, updateFn(previousData));
    }

    try {
      // Perform the actual mutation
      const result = await mutationFn();

      // Update with server response
      this.queryClient.setQueryData(queryKey, result);

      return result;
    } catch (error) {
      // If the mutation fails, rollback to the previous data
      this.queryClient.setQueryData(queryKey, previousData);
      throw error;
    }
  }
}

// Real-time data synchronization
export class RealTimeSync {
  private static connections: Map<string, WebSocket> = new Map();
  private static queryClient = queryClient;

  static connect(endpoint: string, queryKeys: string[][]) {
    if (typeof window === 'undefined') return;

    const ws = new WebSocket(endpoint);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleRealtimeUpdate(data, queryKeys);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onopen = () => {
      console.log('WebSocket connected:', endpoint);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected:', endpoint);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => this.connect(endpoint, queryKeys), 5000);
    };

    this.connections.set(endpoint, ws);
    return ws;
  }

  static disconnect(endpoint: string) {
    const ws = this.connections.get(endpoint);
    if (ws) {
      ws.close();
      this.connections.delete(endpoint);
    }
  }

  private static handleRealtimeUpdate(data: any, queryKeys: string[][]) {
    // Debounced update to prevent excessive re-renders
    const debouncedUpdate = debounce((updateData) => {
      queryKeys.forEach(queryKey => {
        this.queryClient.setQueryData(queryKey, (oldData: any) => {
          if (!oldData) return updateData;

          // Merge strategy based on data type
          if (Array.isArray(oldData)) {
            return this.mergeArrayData(oldData, updateData);
          } else if (typeof oldData === 'object') {
            return { ...oldData, ...updateData };
          }

          return updateData;
        });
      });
    }, 100);

    debouncedUpdate(data);
  }

  private static mergeArrayData(oldData: any[], newData: any): any[] {
    if (!Array.isArray(newData)) return oldData;

    // Simple merge strategy - can be enhanced based on needs
    const merged = [...oldData];
    newData.forEach(item => {
      const existingIndex = merged.findIndex(existing => existing.id === item.id);
      if (existingIndex >= 0) {
        merged[existingIndex] = item;
      } else {
        merged.push(item);
      }
    });

    return merged;
  }
}