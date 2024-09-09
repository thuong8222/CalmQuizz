import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground, SafeAreaView, TouchableOpacity, Text, View, Pressable, TextInput, StyleSheet, Alert } from 'react-native';
import ImageResource from '../../../assets/images';
import Config from '../../../provider/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = (props) => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [user, setUser] = useState([]);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const uri = Config.API_URL();
    const LoginPress = async () => {
        setRefreshing(true)
        try {
            let model = {
                Acount: userName,
                password: password
            }

            let rq = await fetch(`${uri}User/UserLogin`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', },
                    body: JSON.stringify(model),
                });
            console.log('model', model);
            let rs = await rq.json();
            console.log('rs login', rs)
            if (rs.status === 'success') {
                Alert.alert('Thông báo', 'Đăng nhập thành công');
                await AsyncStorage.setItem('user-id', rs.data === null ? '' : rs.data);
                navigation.navigate('Home');
                ResetData();

            }
            else if (rs.status === 'error') {
                Alert.alert('Thông báo', rs.message);
            }
        }
        catch (ex) {
            Alert.alert('Thông báo', ex);
        }
        setRefreshing(false)
    }
    const GoBack = () => {
        navigation.goBack();
    }
    const ResetData = () => {
        setPassword('');
        setUserName('');
    }
    const FogetPasswordPress = () => {
        Alert.alert('Thông báo', 'Quên mật khẩu');
    }
    return (
        <SafeAreaView style={{ height: '100%', width: '100%', }}>
            <TouchableOpacity onPress={GoBack} style={{ height: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#a82d8c' }}>
                <Text>{'<<'}</Text>
            </TouchableOpacity>
            <View style={{ height: 200, backgroundColor: '#a82d8c', borderBottomEndRadius: 250, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                <Text style={{ fontSize: 20, fontStyle: 'italic', color: 'white', fontFamily: 'Arial' }}>{'Đăng nhập cùng Calm Quizz ! '}</Text>
            </View>
            <View style={styles.groupInput}>
                <View style={{ marginBottom: 10, gap: 10 }}>
                    <TextInput placeholder='Tên đăng nhập' value={userName} onChangeText={setUserName} style={styles.input}></TextInput>
                    <TextInput placeholder='Mật khẩu' value={password} onChangeText={setPassword} style={styles.input}></TextInput>
                </View>
                <View style={{ height: 25, width: 240, alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={FogetPasswordPress} style={{ height: 25 }}>
                        <Text>{'Quên mật khẩu?'}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={LoginPress} activeOpacity={0.1} style={styles.btnLogin}>
                        <ImageBackground source={ImageResource.btnBorder} style={{ height: 40, width: 250, justifyContent: 'center', alignItems: 'center' }} resizeMode='stretch'>
                            <Text style={{ color: '#edd25a', fontSize: 20, }}>{'Đăng nhập'}</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            </View>

        </SafeAreaView>
    )
}
export default Login;
const styles = StyleSheet.create({
    groupInput: { backgroundColor: '#a82d8c', flex: 1, borderTopRightRadius: 240, borderBottomLeftRadius: 240, justifyContent: 'center', alignItems: 'center', zIndex: 96, gap: 10 },
    btnLogin: { height: 40, width: 250, justifyContent: 'center', alignItems: 'center', zIndex: 99, },
    input: { height: 40, width: 250, backgroundColor: '#e3e3e3', color: '#a82d8c', }
});