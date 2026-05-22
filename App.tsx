import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { usePersistence } from './hooks/usePersistence';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
// import { useFonts, Syne_800ExtraBold } from '@expo-google-fonts/syne';
// import { DMSans_400Regular } from '@expo-google-fonts/dm-sans';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import * as Crypto from 'expo-crypto';
import { setupNotificationHandler } from './hooks/useNotifications';


// Polyfill the global crypto object for uuid
if (typeof global.crypto === 'undefined') {
  Object.defineProperty(global, 'crypto', {
    value: {
      getRandomValues: (array: Uint8Array) => Crypto.getRandomValues(array),
    },
  });
}

import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import ListDetailScreen from './screens/ListDetailScreen';
import { Colors } from './constants/colors';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabIcon({ emoji, color }: { emoji: string; color: string }) {
  return (
    <Text style={{ fontSize: 20, opacity: color === Colors.primary ? 1 : 0.5 }}>
      {emoji}
    </Text>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.secondary,
          borderTopColor: 'rgba(255,255,255,0.08)',
          height: 64,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: 'DMSans_400Regular',
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'My Lists',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="🛒" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="🔍" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="ListDetail" component={ListDetailScreen} />
    </Stack.Navigator>
  );
}

function AppContent() {
  usePersistence();
  setupNotificationHandler();

   if (__DEV__) {
    console.warn = () => {};
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
const [fontsLoaded] = useFonts({
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
});
  // Hide splash screen once fonts are ready
  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}