import React, { useContext, createContext } from 'react';
import { Text, View, StyleSheet, AsyncStorage } from 'react-native';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import AddUserScreen from './screen/AddUserScreen';
import SubjectScreen from './screen/SubjectScreen';
import AddQuestion from './screen/AddQuestion';
import ListScreen from './screen/ListScreen';
import TestScreen from './screen/TestScreen'
import Check from './screen/check'
const AuthContext = createContext();

const globalScreenOptions = {
  headerStyle: { backgroundColor: '#2C6BED' },
  headerTitleStyle: { color: 'white' },
  headerTintColor: 'white',
};

export default function App() {
  const RegisterUser = async (userEmail, userName) => {
    try {
      await AsyncStorage.setItem('email', userEmail);
      await AsyncStorage.setItem('name', userName);
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={RegisterUser}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={globalScreenOptions}>
          <Stack.Screen
            name="AddUser"
            component={AddUserScreen}
            options={{ headerShown: false }}
          />
         
          <Stack.Screen name="Subject" component={SubjectScreen} />
          <Stack.Screen name="AddQuestion" component={AddQuestion} />
          <Stack.Screen name="ListScreen" component={ListScreen} />
            <Stack.Screen name="TestScreen" component={TestScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export { AuthContext };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
