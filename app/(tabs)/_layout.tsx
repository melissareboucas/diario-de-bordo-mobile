import React from 'react';
import { Tabs } from 'expo-router';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';


// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'white',
        },
        tabBarActiveTintColor: '#196966',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Início",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="travels"
        options={{
          tabBarLabel: "Viagens",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="travel-explore" color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          tabBarLabel: "Comunidade",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="groups" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profileSetup"
        options={{
          tabBarLabel: "Perfil",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="keyboard-control" color={color} />,
        }}
      />

      <Tabs.Screen
        name="posts"
        options={{
          href: null,
          tabBarLabel: "posts",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="keyboard-control" color={color} />,
        }}
      />
    </Tabs>
  );
}
