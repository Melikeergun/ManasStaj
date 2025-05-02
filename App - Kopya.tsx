import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, TouchableOpacity, Image } from 'react-native';

import LogIn from './LogIn';
import ForgotPasswordScreen from './ForgotPasswordScreen'; 
import ResetPasswordScreen from './ResetPasswordScreen'; 
import HomeScreen from './homeScreen'; 
import MoreDetailScreen from './MoreDetailScreen';
import ConsumptionGraphScreen from './ConsumptionGraphScreen';
import IndexGraphScreen from './IndexGraphScreen';
import SignalQualityScreen from './SignalQualityScreen';
import TemperatureDataScreen from './TemperatureDataScreen';
import MapScreen from './MapScreen'; 

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator
        initialRouteName="LogIn"
        screenOptions={{
          headerStyle: { backgroundColor: '#125763' }, 
          cardStyle: { backgroundColor: '#ffffff' }, 
        }}
      >
        <Stack.Screen
          name="LogIn"
          component={LogIn}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="MoreDetailScreen"
          component={MoreDetailScreen}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="ConsumptionGraphScreen"
          component={ConsumptionGraphScreen}
          options={({ navigation }) => ({
            headerShown: false, // Header'ı gizle
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('MoreDetailScreen')}
                style={{ marginRight: 10 }}
              >
                <Image
                  source={require('./assets/home.png')}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="IndexGraphScreen"
          component={IndexGraphScreen}
          options={({ navigation }) => ({
            headerShown: false,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('MoreDetailScreen')}
                style={{ marginRight: 10 }}
              >
                <Image
                  source={require('./assets/home.png')}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="SignalQualityScreen"
          component={SignalQualityScreen}
          options={({ navigation }) => ({
            headerShown: false,
            title: 'Signal Quality',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('MoreDetailScreen')}
                style={{ marginRight: 10 }}
              >
                <Image
                  source={require('./assets/home.png')}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="TemperatureDataScreen"
          component={TemperatureDataScreen}
          options={({ navigation }) => ({
            headerShown: false,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('MoreDetailScreen')}
                style={{ marginRight: 10 }}
              >
                <Image
                  source={require('./assets/home.png')}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
         <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={({ navigation }) => ({
            headerShown: false,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('MoreDetailScreen')}
                style={{ marginRight: 10 }}
              >
                
              </TouchableOpacity>
            ),
          })}
        />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
