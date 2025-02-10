import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@/context/api';
import { User } from '@/constants/Types';
import { Alert } from 'react-native';

/**
 * Custom hook to fetch stats for a given user
 * @param user - user object to fetch stats for
 */
export function useStats(user: User) {
    const api = useApi();
    const [earnings, setEarnings] = useState(0.00);
    const [soldItems, setSoldItems] = useState(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/users/${user?.id}/stats/`);
            const result = await response.json();

            if (response.ok) {
                console.log("Received all stats: ", result);

                setEarnings(result.totalEarnings);
                setSoldItems(result.itemsSold);

            } else {
                setEarnings(0.00)
                setSoldItems(0)
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            Alert.alert('Error', 'Failed to connect to the server. Please check your connection.');
        }
    }, [user]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { earnings, soldItems, loading, error, refetch: fetchStats };
}
