/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Container from './main';
import { store } from './src/store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import messaging from '@react-native-firebase/messaging';
import axiosClient from './src/api/axiosClient';
import notifee, { AndroidImportance } from '@notifee/react-native';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  useEffect(() => {
    async function initFCM() {
      await notifee.requestPermission();
      await messaging().requestPermission();

      await notifee.createChannel({
        id: 'fire-alert',
        name: 'Fire Alert',
        importance: AndroidImportance.HIGH,
      });

      const token = await messaging().getToken();
      console.log('🔥 FCM TOKEN:', token);

      const currentHouseId = store.getState().house.selectedHomeId;
      if (currentHouseId) {
        await axiosClient.post('/fcm/register', {
          token,
          platform: 'android',
          houseId: currentHouseId,
        });
      }

      messaging().onMessage(async remoteMessage => {
        await notifee.displayNotification({
          title: remoteMessage.notification?.title ?? 'CẢNH BÁO',
          body: remoteMessage.notification?.body ?? '',
          android: {
            channelId: 'fire-alert',
            importance: AndroidImportance.HIGH,
          },
        });
      });
    }

    initFCM();
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Container />
        </QueryClientProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
