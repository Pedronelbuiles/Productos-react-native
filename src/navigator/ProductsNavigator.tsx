import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ProductsScreen } from '../screens/ProductsScreen'
import { ProductScreen } from '../screens/ProductScreen'

export type ProductsStackParams = {
    Products: undefined,
    Product: {id?: string, name?: string}
}

const Stack = createStackNavigator<ProductsStackParams>()

export const ProductsNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                cardStyle:{
                    backgroundColor: 'white'
                },
                headerStyle: {
                    elevation: 0,
                    shadowColor: 'transparent'
                }
            }}
        >
            <Stack.Screen
                name="Products"
                component={ProductsScreen}
                options={{title: 'Productos'}}
            />
            <Stack.Screen
                name="Product"
                component={ProductScreen}
            />
        </Stack.Navigator>
    )
}
