/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, ScrollView, StatusBar, Text} from 'react-native';
import messaging from '@react-native-firebase/messaging';

type Nullable<T> = T | undefined | null;
interface Notification {
  title?: Nullable<string>;
  body?: Nullable<string>;
  origin?: Nullable<string>;
  data?: Nullable<object>;
}

const App = () => {
  const [myNotif, setMyNotify] = React.useState<Notification>({});

  React.useEffect(() => {
    messaging()
      .getToken()
      .then(token => {
        console.log('getToken', token);
      });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('App was on the background', remoteMessage.notification);

      setMyNotify({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        origin: 'onNotificationOpenedApp',
        data: remoteMessage.data,
      });
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App was closed', remoteMessage.notification);

          setMyNotify({
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            origin: 'getInitialNotification',
            data: remoteMessage.data,
          });
        }
      });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('App was on the foreground', remoteMessage);
      setMyNotify({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        origin: 'onMessage',
        data: remoteMessage.data,
      });
    });

    return () => {
      unsubscribe();
      messaging().onTokenRefresh(token => {
        console.log('onTokenRefresh', token);
      });
    };
  }, []);

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text>Hello Push Notifications!</Text>
        <Text>Title: {myNotif.title}</Text>
        <Text>Body: {myNotif.body}</Text>
        <Text>Origin: {myNotif.origin}</Text>
        <Text>Data: {JSON.stringify(myNotif.data)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
