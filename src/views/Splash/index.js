import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {

        const timer = setTimeout(async () => {
            const userId = await AsyncStorage.getItem('user-id');
            //AsyncStorage.removeItem('user-id'); => dang xuat
            if (userId === '' || userId === null || typeof userId === 'undefined') {
                navigation.navigate('Auth'); // Chuyển đến trang chủ sau 3 giây
            }
            else {
                navigation.navigate('Home');
            }
        }, 1000); // 3 giây delay

        return () => clearTimeout(timer); // Hủy timer khi component bị unmounted
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'pink' }}>
            <Text style={{ color: 'white', fontSize: 20 }}>{'CALM QUIZZ'}</Text>
        </View>
    );
};

export default SplashScreen;