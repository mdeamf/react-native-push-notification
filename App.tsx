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
import {StyleSheet, Text, View} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

type Nullable<T> = T | undefined | null;
interface Notification {
  title?: Nullable<string>;
  body?: Nullable<string>;
  origin?: Nullable<string>;
  data?: Nullable<{[key: string]: string}>;
}

const OnePage: React.FC = () => {
  return (
    <View style={styles.page}>
      <Text>This is my One Page!</Text>
      <Text>Welcome!</Text>
    </View>
  );
};

const AnotherPage: React.FC = () => (
  <>
    <Text>This is my Another Page!</Text>
    <Text>This opened via Push Notification!</Text>
  </>
);

const App = () => {
  const [myNotif, setMyNotify] = React.useState<Notification>({});

  const navigationRef = React.createRef<any>();

  const PushNotificationContent = () => {
    return (
      <View style={styles.notif}>
        <Text>Hello Push Notifications!</Text>
        <Text>Title: {myNotif.title}</Text>
        <Text>Body: {myNotif.body}</Text>
        <Text>Origin: {myNotif.origin}</Text>
        <Text>Data: {JSON.stringify(myNotif.data)}</Text>
      </View>
    );
  };

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

  React.useEffect(() => {
    if (myNotif.data?.PageToOpen) {
      console.log('Navigating to', myNotif.data.PageToOpen);
      navigationRef.current?.navigate(myNotif.data.PageToOpen);
    }
  }, [myNotif, navigationRef]);

  const Stack = createStackNavigator();

  return (
    <>
      <PushNotificationContent />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={OnePage} />
          <Stack.Screen name="AnotherPage" component={AnotherPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const styles = StyleSheet.create({
  notif: {
    margin: 16,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
