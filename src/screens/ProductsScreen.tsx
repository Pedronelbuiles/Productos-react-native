import React, { useContext, useEffect, useState } from 'react'
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ProductsContext } from '../context/ProductsContext'
import { StackScreenProps } from '@react-navigation/stack';
import { ProductsStackParams } from '../navigator/ProductsNavigator';

interface Props extends StackScreenProps<ProductsStackParams, 'Products'> {}

export const ProductsScreen = ({navigation}: Props) => {

    const [isRefreshing, setIsRefreshing] = useState(false)
    const {products, loadProducts} = useContext(ProductsContext)

    const loadProductsFromBackend = async() => {
        setIsRefreshing(true)
        await loadProducts()
        setIsRefreshing(false)
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{marginRight: 10}}
                    onPress={() => navigation.navigate('Product', {})}
                >
                    <Text>Agregar</Text>
                </TouchableOpacity>
            )
        })
    }, [])

    return (
        <View style={{ flex: 1, marginHorizontal: 10 }}>
            <FlatList 
                data={products}
                keyExtractor={(p) => p._id}
                renderItem={({item}) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('Product', {id: item._id, name: item.nombre})}
                    >
                        <Text style={style.productName}>{item.nombre}</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                    <View style={style.itemSeparator} />
                )}
                refreshControl={
                    <RefreshControl 
                        refreshing={isRefreshing}
                        onRefresh={loadProductsFromBackend}
                    />
                }
            />
        </View>
    )
}

const style = StyleSheet.create({
    productName:{
        fontSize: 20
    },
    itemSeparator: {
        borderBottomWidth: 3,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        marginVertical: 5
    }
})