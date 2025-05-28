import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './src/pages/login';
import Atendente from './src/pages/atendente';
import Garcom from './src/pages/garcom';
import Gerente from'./src/pages/gerente';




const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Atendente" component={Atendente} />
       <Stack.Screen name="Garcom" component={Garcom} />
        <Stack.Screen name="Gerente" component={Gerente} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
