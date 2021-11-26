import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ProtectedScreen } from '../screens/ProtectedScreen';
import { AuthContext } from '../context/AuthContext';
import { LoadingScreen } from '../screens/LoadingScreen';
import { ProductsNavigator } from './ProductsNavigator';

const Stack = createStackNavigator();

export const Navigator = () => {

  const {status} = useContext(AuthContext)

  if ( status === 'checking' ) return <LoadingScreen />

  return (
    <Stack.Navigator
        screenOptions={{
            headerShown:false,
            cardStyle: {
                backgroundColor: 'white'
            }
        }}
    >
      {
        status !== 'authenticated' 
        ? 
          (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )
          :
            <>
              <Stack.Screen name="ProductsNavigator" component={ProductsNavigator} />
              <Stack.Screen name="Protected" component={ProtectedScreen} />
            </>
        }
    </Stack.Navigator>
  );
}