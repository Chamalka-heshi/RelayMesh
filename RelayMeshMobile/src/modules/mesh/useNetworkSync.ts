import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { MeshService } from './meshService';

export const useNetworkSync = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncCount, setLastSyncCount] = useState(0);

  useEffect(() => {
    // Listen for network connectivity changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected && state.isInternetReachable !== false;
      setIsConnected(online);

      // Auto-trigger cloud sync when connection transitions to ONLINE
      if (online) {
        triggerAutoSync();
      }
    });

    return () => unsubscribe();
  }, []);

  const triggerAutoSync = async () => {
    console.log('--- Triggering Cloud Ingestion ---');
    console.log('Network status:', isConnected);

    setIsSyncing(true);
    try {
      const result = await MeshService.syncQueueToCloud();
      console.log('Sync result:', result);

      if (result.success) {
        setLastSyncCount(result.count);
      }
    } catch (e) {
      console.error('Manual sync error:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  return { isConnected, isSyncing, lastSyncCount, triggerAutoSync };
}; 