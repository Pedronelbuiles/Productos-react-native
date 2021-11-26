import React, { createContext, useEffect, useState } from "react";
import { ImagePickerResponse } from "react-native-image-picker";
import cafeApi from "../api/cafeApi";
import { Producto, ProductsResponse } from '../interfaces/appInterfaces';

type ContextProps = {
    products: Producto[];
    loadProducts: () => Promise<void>;
    addProduct: (categoryId: string, productName:string) => Promise<any>;
    updateProduct: (categoryId: string, productName:string, productId:string) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    loadProductById: (id: string) => Promise<Producto>;
    uploadImage: (data: any, id: string) => Promise<void>;
}

export const ProductsContext =  createContext({} as ContextProps)

export const ProductsProvider = ({children}: any) => {

    const [products, setProducts] = useState<Producto[]>([])

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async() => {
        const resp = await cafeApi.get<ProductsResponse>('/productos?limite=50')
        setProducts([...resp.data.productos])
    }

    const addProduct = async(categoryId: string, productName:string): Promise<any> => {
        try {
            const resp = await cafeApi.post<Producto>('/productos', {
                nombre: productName,
                categoria: categoryId
            })
            setProducts([...products, resp.data])
            return resp.data
        } catch (error) {
            console.log(error)
        }
    }

    const updateProduct = async(categoryId: string, productName:string, productId:string) => {
        try {
            const resp = await cafeApi.put<Producto>(`/productos/${productId}`, {
                nombre: productName,
                categoria: categoryId
            })
            setProducts(products.map(prod => (prod._id === productId) ? resp.data : prod))
        } catch (error) {
            console.log(error)
        }
    }

    const deleteProduct = async(id: string) => {

    }

    const loadProductById = async(id: string):Promise<Producto> => {
        const resp = await cafeApi.get<Producto>(`/productos/${id}`)
        return resp.data
    }

    const uploadImage = async(data: ImagePickerResponse, id: string) => {
        
        try {
            if (!data.assets) return
            const {uri, type, fileName} = data.assets[0]
    
            const fileToUpload = {
                name: fileName,
                uri,
                type 
            }
    
            const formData = new FormData()
            formData.append('archivo', fileToUpload)
            
            const resp = await cafeApi.put(`/uploads/productos/${id}`, formData)
            console.log(resp)
        } catch (error) {
            
        }
    }

    return (
        <ProductsContext.Provider
            value={{
                products,
                loadProducts,
                addProduct,
                updateProduct,
                deleteProduct,
                loadProductById,
                uploadImage
            }}
        >
            {children}
        </ProductsContext.Provider>
    )
}
