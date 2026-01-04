import { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useSelector } from 'react-redux';
import axiosClient from '../api/axiosClient';
import { RootState } from '../store/store';

export function useFcm() {
  const houseId = useSelector(
    (state: RootState) => state.house.selectedHomeId,
  );
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    if (!isLoggedIn || !houseId) return;

    const registerToken = async () => {
      await messaging().requestPermission();
      const token = await messaging().getToken();

      await axiosClient.post('/fcm/register', {
        token,
        platform: 'android',
        houseId,
      });
    };

    registerToken();

    // 🔥 HANDLE TOKEN REFRESH
    const unsubscribe = messaging().onTokenRefresh(token => {
      axiosClient.post('/fcm/register', {
        token,
        platform: 'android',
        houseId,
      });
    });

    return unsubscribe;
  }, [isLoggedIn, houseId]);
}
