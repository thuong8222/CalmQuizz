import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground, SafeAreaView, TouchableOpacity, Text, View, Pressable, TextInput, Alert, StyleSheet } from 'react-native';
import ImageResource from '../../../assets/images';
import Config from '../../../provider/Config';
const uri = Config.API_URL();
const Register = (props) => {
    const navigation = useNavigation();
    const [fullname, setFullname] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const GoBack = () => {
        navigation.goBack();
    }
    const ResetData = () => {
        setFullname('');
        setPassword('');
        setUserName('');
    }
    const RegisterPress = async () => {

        let model = {
            name: fullname,
            Acount: userName,
            Password: password
        }
        let rq = await fetch(`${uri}User/UserRegister`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify(model),
            });
        console.log('model', model)
        let rs = await rq.json();
        console.log('rs', rs);
        if (rs.status === 'success') {
            Alert.alert('Thông báo', 'Đăng ký thành công');
            navigation.navigate('Login');


        }
        else if (rs.status === 'error') {
            Alert.alert('Thông báo', rs.message);
        }

    }
    return (
        <SafeAreaView style={{ height: '100%', width: '100%', }}>
            <TouchableOpacity onPress={GoBack} style={{ height: 50, width: 50 }}><Text>{'<<'}</Text></TouchableOpacity>
            <View style={{ height: 200, backgroundColor: '#a82d8c', borderBottomEndRadius: 250, justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                <Text style={{ fontSize: 20, fontStyle: 'italic', color: 'white', fontFamily: 'Arial' }}>{'Đăng ký cùng Calm Quizz ! '}</Text>
            </View>
            <View style={styles.groupInput}>
                <View style={{ marginBottom: 10, gap: 10 }}>
                    <TextInput value={fullname} onChangeText={setFullname} placeholder='Họ và tên' style={styles.input}></TextInput>
                    <TextInput value={userName} onChangeText={setUserName} placeholder='Tên đăng nhập' style={styles.input}></TextInput>
                    <TextInput value={password} onChangeText={setPassword} placeholder='Mật khẩu' style={styles.input}></TextInput>
                </View>

                <View>
                    <TouchableOpacity onPress={RegisterPress} activeOpacity={0.1} style={styles.btnRegister}>
                        <ImageBackground source={ImageResource.btnBorder} style={{ height: 40, width: 250, justifyContent: 'center', alignItems: 'center' }} resizeMode='stretch'>
                            <Text style={{ color: '#edd25a', fontSize: 20, }}>{'Đăng ký'}</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>

            </View>

        </SafeAreaView>
    )
}
export default Register;
const styles = StyleSheet.create({
    groupInput: { backgroundColor: '#a82d8c', flex: 1, borderTopRightRadius: 240, borderBottomLeftRadius: 240, justifyContent: 'center', alignItems: 'center', zIndex: 96, gap: 10 },
    btnLogin: { height: 40, width: 250, justifyContent: 'center', alignItems: 'center', zIndex: 99, },
    input: { height: 40, width: 250, backgroundColor: '#e3e3e3', color: '#a82d8c', },
    btnRegister: { height: 40, width: 250, justifyContent: 'center', alignItems: 'center', zIndex: 99, }
});