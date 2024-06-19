import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/components/Login';
import Register from './src/components/Register';
import Home from './src/components/Home';
import SensorRegistration from './src/components/SensorRegistration';
import SensorList from './src/components/SensorList';
import UserProfile from './src/components/UserProfile';
import Map from './src/components/Map';
import Filter from './src/components/Filter';
import AlterarSensor from './src/components/AlterarSensor';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SensorRegistration" component={SensorRegistration} />
        <Stack.Screen name="SensorList" component={SensorList} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="Filter" component={Filter} />
        <Stack.Screen name="AlterarSensor" component={AlterarSensor} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
