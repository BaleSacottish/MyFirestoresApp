import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, Alert, View, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'

import Index1 from './src/screens/index1';
import Index2 from './src/screens/index2';
import Index3 from './src/screens/index3';

const Tab = createBottomTabNavigator();

const App = () => {




  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Index1') {
              iconName = 'add-circle';
            } if (route.name === 'Index2') {
              iconName = 'home';
            } else if (route.name == 'Index3') {
              iconName = 'home'
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
          style: {
            backgroundColor: 'white',
          },
        }}
      >
        <Tab.Screen name="Index1" component={Index1} />
        <Tab.Screen name="Index2" component={Index2} />
        <Tab.Screen name="Index3" component={Index3} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default App;