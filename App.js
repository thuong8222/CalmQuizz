import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/views/Home';
import Splash from './src/views/Splash';
import Auth from './src/views/Auth';
import Login from './src/views/Auth/Login';
import Register from './src/views/Auth/Register';
import Quizz from './src/views/Quizz';
function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home}     // options={{ title: 'Welcome' }}   
        />
        <Stack.Screen name="Quizz" component={Quizz} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="SplashScreen" component={Splash} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;