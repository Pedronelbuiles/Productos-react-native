import React, { createContext, useEffect, useReducer } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import cafeApi from "../api/cafeApi";
import { Usuario, LoginResponse, LoginData, RegisterData } from '../interfaces/appInterfaces';
import { AuthReducer, AuthState } from "./AuthReducer";

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signIn: (loginDara: LoginData) => void;
    signUp: (RegisterData: RegisterData) => void;
    logOut: () => void;
    removeError: () => void;
}

const AuthInitialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''
}

export const AuthContext = createContext({} as AuthContextProps)

export const AuthProvider = ({children}: any) => {

    useEffect(() => {
        checkToken()
    }, [])

    const checkToken = async ()  => {
        const token = await AsyncStorage.getItem('token')

        if (!token) return dispatch({type: 'notAuthenticated'})

        const {data, status} = await cafeApi.get('/auth')

        if (status !== 200) {
            return dispatch({type: 'notAuthenticated'})
        }

        await AsyncStorage.setItem('token', data.token)
        dispatch({type: 'signUp', payload: {token: data.token, user: data.usuario}})
    }

    const [state, dispatch] = useReducer(AuthReducer, AuthInitialState)

    const signIn = async ({correo, password}: LoginData) => {
        try {
            const {data} = await cafeApi.post<LoginResponse>('/auth/login', {correo, password})
            dispatch({type: 'signUp', payload: {token: data.token, user: data.usuario}})
            await AsyncStorage.setItem('token', data.token)
        } catch (error: any) {
            dispatch({type: 'addError', payload: error.response.data.msg || 'Información incorrecta'})
            console.log(error.response.data.msg)
        }
    }

    const signUp = async({nombre, correo, password}: RegisterData) => {
        try {
            const {data} =  await cafeApi.post<LoginResponse>('/usuarios', {nombre, correo, password, email: correo})
            dispatch({type: 'signUp', payload: {token: data.token, user: data.usuario}})
            await AsyncStorage.setItem('token', data.token)
        } catch (error: any) {
            dispatch({type: 'addError', payload: error.response.data.errors[0].msg || 'Por favor revise la información'})
            console.log(error.response.data.msg)
        }
    }

    const logOut = async() => {
        await AsyncStorage.removeItem('token')
        dispatch({type: 'logOut'})
    }
    
    const removeError = () => {
        dispatch({type: 'removeError'})
    }

    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError
        }}>
            {children}
        </AuthContext.Provider>
    )
}