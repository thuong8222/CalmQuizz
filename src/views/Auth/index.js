import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground, SafeAreaView, TouchableOpacity, Text, View, Pressable } from 'react-native';
import ImageResource from '../../assets/images';
const Auth = (props) => {
    const navigation = useNavigation();
    const GoToLoginScreen = () => {
        navigation.navigate('Login');
    }
    const GoToRegisterScreen = () => {
        navigation.navigate('Register');
    }
    return (
        <SafeAreaView style={{ height: '100%', width: '100%', }}>

            <View style={{ height: 200, backgroundColor: '#a82d8c', borderBottomEndRadius: 250, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                <Text style={{ fontSize: 20, fontStyle: 'italic', color: 'white', fontFamily: 'Arial' }}>{'Calm Quizz Xin chào! '}</Text>
            </View>
            <View style={{ backgroundColor: '#a82d8c', flex: 1, borderTopRightRadius: 240, borderBottomLeftRadius: 240, justifyContent: 'center', alignItems: 'center', zIndex: 96 }}>
                <TouchableOpacity onPress={GoToLoginScreen} activeOpacity={0.1} style={{ height: 80, width: 250, justifyContent: 'center', alignItems: 'center', zIndex: 99, }}>
                    <ImageBackground source={ImageResource.btnBorder} style={{ height: 100, width: 250, justifyContent: 'center', alignItems: 'center' }} resizeMode='stretch'>
                        <Text style={{ color: '#edd25a', fontSize: 20, }}>{'Đăng nhập'}</Text>
                    </ImageBackground>

                </TouchableOpacity>
                <TouchableOpacity onPress={GoToRegisterScreen} style={{ height: 80, width: 200, justifyContent: 'center', alignItems: 'center', borderBottombuLeftRadius: 40 }}>
                    <ImageBackground source={ImageResource.btnBorder} style={{ height: 80, width: 250, justifyContent: 'center', alignItems: 'center', }} imageStyle={{ transform: [{ rotateZ: '180deg' }] }} resizeMode='stretch'>
                        <Text style={{ color: '#edd25a', fontSize: 20, }}>{'Đăng ký'}</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}
export default Auth;