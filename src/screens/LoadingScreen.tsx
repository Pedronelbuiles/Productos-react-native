import React, { useEffect } from 'react'
import { ActivityIndicator, Text, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen'

export const LoadingScreen = () => {

    useEffect(() => {
        SplashScreen.hide()
    }, [])

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <ActivityIndicator 
                size={50}
                color='black'
            />
            <Text>Un momento por favor...</Text>
        </View>
    )
}
