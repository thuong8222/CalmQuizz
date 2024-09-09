import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground, SafeAreaView, TouchableOpacity, Text, View, RefreshControl, Image, FlatList, Alert, StyleSheet } from 'react-native';
import ImageResource from '../../assets/images';
import Config from '../../provider/Config';
const uri = Config.API_URL();
const Home = (props) => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = React.useState(false);
    const [listQuizz, setListQuizz] = useState([]);
    const LoadListQuizz = async () => {
        setRefreshing(true)
        try {
            let rq = await fetch(`${uri}Topic/GetListTopic`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });

            let rs = await rq.json();
            console.log('rs', rs)
            if (rs.status === 'success') {
                setListQuizz(rs.data);
            }
            else if (rs.status === 'error') {
                console.log('Thông báo', rs.message);
            }
        }
        catch (ex) {
            console.log('ex', ex);
        }
        setRefreshing(false)
    }
    useEffect(() => {
        LoadListQuizz();
    }, []);

    const GoToListQs = (model) => {
        navigation.navigate('Quizz', { topicId: model.topicId, topicName: model.topicName });
    }
    const listQuizz_Render = ({ item, index }) => {
        return (
            <ListQuizz_Item data={item} ReGoToListQsPress={GoToListQs} />
        )
    }
    const listQuizz_ItemSeparatorComponent = () => {
        return (
            <View style={{ height: 5 }}></View>
        )
    }
    return (
        <SafeAreaView style={{ height: '100%', width: '100%', }}>
            <View style={styles.divTitle}>
                <Image source={ImageResource.icoPig} style={{ height: 150, width: 150 }} resizeMode='contain' />
                <Text style={{ fontSize: 20, fontStyle: 'italic', color: 'white', fontFamily: 'Arial' }}>{'Chủ đề Quizz'}</Text>
            </View>
            <View style={{ backgroundColor: '#a82d8c', flex: 1, borderTopRightRadius: 240, borderBottomLeftRadius: 240, padding: 10 }}>
                <FlatList
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={LoadListQuizz} />}

                    data={listQuizz}
                    renderItem={listQuizz_Render}
                    ItemSeparatorComponent={listQuizz_ItemSeparatorComponent}
                />
            </View>
        </SafeAreaView>
    );
};
const ListQuizz_Item = (props) => {
    const GoToListQsPress = () => {
        props.ReGoToListQsPress(props.data);
    }
    return (
        <TouchableOpacity onPress={GoToListQsPress} style={{ flexDirection: 'row', height: 80, alignItems: 'center', backgroundColor: '#ffffff80', borderRadius: 20 }}>
            <Image source={ImageResource.icoPig} style={{ height: 60, width: 60 }} resizeMode='contain' ></Image>
            <View style={{ flex: 1 }}>
                <View>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>{props.data.topicName} </Text>
                </View>
            </View>
            <View style={{ marginRight: 10, width: 40, height: 40, borderRadius: 25, backgroundColor: '#edd25a', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#a82d8c', fontSize: 12 }}>{props.data.toltalQuestion} </Text>
            </View>
        </TouchableOpacity>
    )
}

export default Home;
const styles = StyleSheet.create({
    groupInput: { backgroundColor: '#a82d8c', flex: 1, borderTopRightRadius: 240, borderBottomLeftRadius: 240, justifyContent: 'center', alignItems: 'center', zIndex: 96, gap: 10 },
    btnLogin: { height: 40, width: 250, justifyContent: 'center', alignItems: 'center', zIndex: 99, },
    input: { height: 40, width: 250, backgroundColor: '#e3e3e3', color: '#a82d8c', },
    divTitle: { height: 150, backgroundColor: '#a82d8c', borderBottomEndRadius: 250, alignItems: 'center', flexDirection: 'row' }
});