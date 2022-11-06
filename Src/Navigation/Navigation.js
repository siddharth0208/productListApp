import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Products from '../Screens/Products';
import ProductsDetails from '../Screens/ProductsDetails';
import Colors from '../Constants/Colors';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: Colors.red,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen name="Products" component={Products} />
        <Stack.Screen
          name="ProductsDetails"
          component={ProductsDetails}
          options={{
            title: 'Products Details',
            headerBackTitle: 'titile',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
