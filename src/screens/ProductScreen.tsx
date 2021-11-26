import React, { useContext, useEffect, useState } from 'react'
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { Picker } from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import { StackScreenProps } from '@react-navigation/stack';
import { ProductsStackParams } from '../navigator/ProductsNavigator';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';
import { ProductsContext } from '../context/ProductsContext';

interface Props extends StackScreenProps<ProductsStackParams, 'Product'> {}

export const ProductScreen = ({ navigation, route }: Props) => {

    const {id = '', name = ''} = route.params

    const [tempUri, settempUri] = useState<string>()

    const { categories, isLoading } = useCategories()

    const { loadProductById, addProduct, updateProduct, uploadImage } = useContext(ProductsContext)

    const {_id, categoriaId, nombre, img, form, onChange, setFormValue } = useForm({
        _id: id,
        nombre: name,
        categoriaId: '',
        img: ''
    })

    const loadProduct = async() => {
        if (id.length === 0) return
        const product = await loadProductById(id)
        setFormValue({
            _id: id,
            categoriaId: product.categoria._id,
            img: product.img || '',
            nombre
        })
    }

    const saveOrUpdate = async() => {
        if (id.length > 0) {
            updateProduct(categoriaId, nombre, id)
        }else {
            const tempCategoriaId = categoriaId || categories[0]._id
            const newProduct = await addProduct(tempCategoriaId, nombre)
            onChange(newProduct._id, '_id')
        }
    }

    const takePhoto = () => {
        launchCamera({
            mediaType: 'photo',
            quality: 0.5
        }, (resp) => {
            if (resp.didCancel) return
            if (!resp.assets || !resp.assets[0].uri) return
            settempUri(resp.assets[0].uri)
            uploadImage(resp, _id)
        })
    }

    const taakePhotoFromGallery = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.5
        }, (resp) => {
            if (resp.didCancel) return
            if (!resp.assets || !resp.assets[0].uri) return
            settempUri(resp.assets[0].uri)
            uploadImage(resp, _id)
        })
    }

    useEffect(() => {
        navigation.setOptions({
            title: (nombre) ? nombre : 'Sin nombre del producto'
        })
    }, [nombre])

    useEffect(() => {
        loadProduct()
    }, [])

    return (
        <View style={style.container}>
            <ScrollView>
                <Text style={style.label}>Nombre del producto</Text>
                <TextInput 
                    placeholder="Producto"
                    style={style.textInput}
                    value={nombre}
                    onChangeText={(value) => onChange(value, 'nombre')}
                />

                <Text style={style.label}>Categoria</Text>
                <Picker
                    selectedValue={categoriaId}
                    onValueChange={(value) => onChange(value, 'categoriaId')}
                >
                    {
                        categories.map(c => (
                            <Picker.Item 
                                label={c.nombre}
                                value={c._id}
                                key={c._id}
                            />
                        ))
                    }
                </Picker>

                <Button 
                    title="Guardar"
                    onPress={saveOrUpdate}
                    color="#5856D6"
                />

                {
                    _id.length > 0 &&
                        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
                            <Button 
                                title="Cámara"
                                onPress={takePhoto}
                                color="#5856D6"
                            />  
                            <View style={{width: 10}} />
                            <Button 
                                title="Galeria"
                                onPress={taakePhotoFromGallery}
                                color="#5856D6"
                            />
                        </View>
                }

                {
                    (img.length > 0 && !tempUri) && 
                        <Image 
                            source={{uri: img}}
                            style={{
                                marginTop: 20,
                                width: '100%',
                                height: 300
                            }}
                        />
                }
                {
                    tempUri && 
                        <Image 
                            source={{uri: tempUri}}
                            style={{
                                marginTop: 20,
                                width: '100%',
                                height: 300
                            }}
                        />
                }
            </ScrollView>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20
    },
    label: {
        fontSize: 18
    },
    textInput: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 45,
        marginTop: 5,
        marginBottom: 15
    }
})
