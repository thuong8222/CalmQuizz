import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ImageBackground, SafeAreaView, TouchableOpacity, RefreshControl, Text, View, Pressable, Image, FlatList, Alert, Dimensions } from 'react-native';
import ImageResource from '../../assets/images';
import Config from '../../provider/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SCREEN = {
    WIDTH: Dimensions.get('window').width,
    HEIGHT: Dimensions.get('window').height, //ip: screen, window co the nhu nhau.
    // android: khac, screen la man hinh, con window la cua so cac man hinh
}
const uri = Config.API_URL();
const Quizz = (props) => {
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = React.useState(false);
    const [seconds, setSeconds] = useState(15);
    const { topicId } = props.route.params;
    const { topicName } = props.route.params;

    const [listQs, setListQs] = useState([]);
    const [currentQsDescription, setCurrentQsDescription] = useState('');
    const [currentQsNo, setCurrentQsNo] = useState(0);
    const [listQsAnswer, setListQsAnswer] = useState([]);
    const [listQsAnswerForSelect, setListQsAnswerForSelect] = useState([]);
    const [listQsAnswerSelected, setListQsAnswerSelected] = useState([]);
    const [questionId, setQuestionId] = useState();
    const [isToggleModal, setIsToggleModal] = useState(false);
    const [isStart, setIsStart] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const ListQuestion = async () => {
        setRefreshing(true)
        try {
            let _questionID;
            let rq = await fetch(`${uri}Question/GetListQuestion?topicId=${topicId}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
            let rs = await rq.json();
            console.log('GetListQuestion rs', rs)
            if (rs.status === 'success') {
                let _listQs = rs.data.listQuestion;
                setCurrentQsDescription(rs.data.listQuestion[currentQsNo].description);
                setQuestionId(rs.data.listQuestion[currentQsNo].questionId);
                _questionID = rs.data.listQuestion[currentQsNo].questionId;

                setListQs([..._listQs]);
                setListQsAnswer(rs.data.listQuestionAnswer);

                let _listQsAnswerForSelect = []
                for (let i = 0; i < rs.data.listQuestionAnswer.length; i++) {
                    if (rs.data.listQuestionAnswer[i].questionId === _questionID) {
                        _listQsAnswerForSelect.push(rs.data.listQuestionAnswer[i]);

                    }
                }
                setListQsAnswerForSelect([..._listQsAnswerForSelect])
            }
            else if (rs.status === 'error') {
                console.log('loi:', rs.message);
            }


        }
        catch (ex) {
            console.log('ListQuestion ex', ex);
        }
        setRefreshing(false)
    }

    const ToggleSplashModal = () => {
        setIsStart(!isStart);
    }
    useEffect(() => {
        setIsStart(true);

    }, []);

    const StartPress = () => {
        setIsStart(false);
        ListQuestion();

    }

    const ChoseQs = (index) => {

        setCurrentQsNo(index);
        setQuestionId(listQs[index].questionId);
        setCurrentQsDescription(listQs[index].description);

        let _listQsAnswerForSelect = []
        for (let i = 0; i < listQsAnswer.length; i++) {
            if (listQsAnswer[i].questionId === listQs[index].questionId) {
                _listQsAnswerForSelect.push(listQsAnswer[i]);
            }
        }
        setListQsAnswerForSelect([..._listQsAnswerForSelect]);

        setIsToggleModal(false);
    }
    const GotoPreQuestion = () => {
        let i = -1;
    }
    const Qs_renderItem = ({ item, index }) => {
        return (
            <QsItem data={item} index={index} ReChoseQsPress={ChoseQs} />
        );
    }
    const GoBack = () => {
        Alert.alert('Thông báo', 'Bạn có chắc chắn muốn thoát câu hỏi không?',
            [
                { text: 'Đồng ý', onPress: () => { navigation.goBack() } },
                { text: 'Đóng', onPress: () => { } }
            ]
        )
    }
    const ViewListQs = () => {
        if (isToggleModal === true) {
            setIsToggleModal(false)
        }
        if (isToggleModal === false) {
            setIsToggleModal(true)
        }

    }
    const SelectedAnswer = (item) => {

        let _listQsAnswer = listQsAnswer;

        for (let i = 0; i < _listQsAnswer.length; i++) {
            if (_listQsAnswer[i].questionId === item.item.questionId) {
                if (item.item.questionAnswerId === _listQsAnswer[i].questionAnswerId) {
                    _listQsAnswer[i].isSelected = true;
                } else {
                    _listQsAnswer[i].isSelected = false;
                }
            }

        }

        let _listQsAnswerSelected = listQsAnswerSelected;
        if (_listQsAnswerSelected.length <= 0) _listQsAnswerSelected.push({ questionId: item.item.questionId, questionAnswerId: item.item.questionAnswerId });
        else {
            let indexResult = -1;
            for (let j = 0; j < _listQsAnswerSelected.length; j++) {
                if (_listQsAnswerSelected[j].questionId === item.item.questionId) {
                    indexResult = j;
                }
            }

            if (indexResult === -1) {
                _listQsAnswerSelected.push({ questionId: item.item.questionId, questionAnswerId: item.item.questionAnswerId });
            } else {
                _listQsAnswerSelected[indexResult].questionAnswerId = item.item.questionAnswerId
            }
        }

        console.log('_listQsAnswerSelected', _listQsAnswerSelected)
        setListQsAnswer([..._listQsAnswer]);
        setListQsAnswerSelected([..._listQsAnswerSelected]);

    }
    const Answer_renderItem = (item, index) => {
        return (
            <AnswerItem data={item} ReChoseAnswerPress={SelectedAnswer} />
        )
    }
    const Answer_ItemSeparatorComponent = (item) => {
        <View style={{ height: 10 }}></View>
    }
    const Submit = async () => {
        try {
            const userId = await AsyncStorage.getItem('user-id');
            let model = {
                UserId: userId,
                TopicId: topicId,
                ListAnswer: listQsAnswerSelected
            }
            let rq = await fetch(`${uri}QuestionAnswer/GetListUserAnswerSelected`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(model)
                });

            let rs = await rq.json();
            if (rs.status === 'success') {
                Alert.alert('Thông báo', 'Diem : ' + rs.data)
            }
            else if (rs.status === 'error') {
                console.log('loi:', rs.message);
            }


        }
        catch (ex) {
            console.log('ex', ex);
        }
    }
    return (
        <SafeAreaView style={{ height: SCREEN.HEIGHT, width: SCREEN.WIDTH, position: 'relative' }}>
            <View style={{ display: isStart ? 'none' : 'flex' }}>
                <View style={{ height: 180, backgroundColor: '#a82d8c', borderBottomEndRadius: 250, alignItems: 'center' }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={GoBack} style={{ height: 60, width: 60 }}>
                            {/* <Image source={ImageResource.icoPig} style={{ height: 60, width: 60 }} resizeMode='contain' /> */}
                            <Text style={{ fontSize: 30, color: 'white' }}>{'<<'}</Text>
                        </TouchableOpacity>
                        <Image source={ImageResource.icoPig} style={{ height: 100, width: 100 }} resizeMode='contain' />
                        <Text style={{ fontSize: 20, fontStyle: 'italic', color: 'white', fontFamily: 'Arial', flex: 1 }}>{'Chủ đề: ' + topicName}</Text>

                        <TouchableOpacity onPress={ViewListQs} style={{ height: 40, width: 40, backgroundColor: '#ffffff80' }}>
                            <Text style={{ color: 'green' }}>{'!'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ backgroundColor: '#fff', height: 200, marginHorizontal: 20, borderRadius: 20, padding: 10, marginTop: -80, alignItems: 'center', zIndex: 1 }}>
                    <View style={{ height: 70, width: 70, borderRadius: 35, backgroundColor: '#edd25a', marginTop: -40, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 24 }}>
                            {seconds === 0 ? 'Hết giờ!' : `${seconds}`}
                        </Text>
                    </View>
                </View>

                <View style={{ backgroundColor: '#edd25a', height: 150, marginHorizontal: 20, borderBottomEndRadius: 20, borderBottomLeftRadius: 20, padding: 10, marginTop: -20, padding: 10 }}>
                    <View style={{ paddingTop: 20 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{'Câu ' + (currentQsNo + 1) + ': '}</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{currentQsDescription}</Text>
                    </View>
                </View>
                <View>
                </View>
                <View style={{ marginTop: 20, gap: 5 }}>
                    <FlatList
                        data={listQsAnswerForSelect}
                        renderItem={Answer_renderItem}
                        ItemSeparatorComponent={Answer_ItemSeparatorComponent}
                    />
                </View>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                    <TouchableOpacity style={{ height: 50, width: 50, backgroundColor: 'red' }}><Text style={{ fontSize: 30 }}>{'<<'}</Text></TouchableOpacity>
                    <TouchableOpacity style={{ height: 50, width: 50, backgroundColor: 'red' }}><Text style={{ fontSize: 30 }}>{'>>'}</Text></TouchableOpacity>

                </View> */}

            </View>
            <View style={{ position: 'absolute', bottom: 50, right: 50 }}><TouchableOpacity onPress={Submit} style={{ height: 60, width: 100, backgroundColor: 'green', }}><Text>{'Nop bai'}</Text></TouchableOpacity></View>
            <SafeAreaView style={{ display: isToggleModal ? 'flex' : 'none', zIndex: 2, height: SCREEN.HEIGHT, width: SCREEN.WIDTH, position: 'absolute', backgroundColor: '#00000080', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={ViewListQs} style={{ height: SCREEN.HEIGHT, width: SCREEN.WIDTH, position: 'absolute' }}></TouchableOpacity>
                <View style={{ height: 300, width: '80%', backgroundColor: '#fff', borderRadius: 20, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <FlatList
                        data={listQs}
                        renderItem={Qs_renderItem}
                        horizontal={true}
                        ItemSeparatorComponent={<View style={{ height: 10 }}></View>}
                    />
                </View>
            </SafeAreaView>

            <SafeAreaView style={{ display: isStart ? 'flex' : 'none', zIndex: 2, height: SCREEN.HEIGHT, width: SCREEN.WIDTH, position: 'absolute', backgroundColor: '#00000080', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity onPress={ToggleSplashModal} style={{ height: SCREEN.HEIGHT, width: SCREEN.WIDTH, position: 'absolute' }}></TouchableOpacity>
                <View style={{ height: 300, width: 300, borderRadius: 20, backgroundColor: '#edd25a60', borderRadius: 150, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={StartPress} style={{ height: 200, width: 200, backgroundColor: '#edd25a', justifyContent: 'center', alignItems: 'center', borderRadius: 100 }}><Text style={{ fontSize: 30, color: '#a82d8c' }}>{'Bắt đầu'}</Text></TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaView>


    );
};
const QsItem = (props) => {
    console.log('QsItem props', props)
    const ChoseQsPress = () => {
        props.ReChoseQsPress(props.index);
    }
    // console.log('props.index', props.index);
    return (
        <TouchableOpacity onPress={ChoseQsPress} style={{ borderBottomWidth: .5, borderColor: '#e3e3e3', width: 50, height: 50, backgroundColor: '#edd25a', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
            <Text>{props.index + 1}</Text>
        </TouchableOpacity>
    );
}
const AnswerItem = (props) => {
    const ChoseAnswerPress = () => {
        props.ReChoseAnswerPress(props.data);
    }
    return (
        <TouchableOpacity onPress={ChoseAnswerPress} style={{ height: 50, backgroundColor: props.data.item.isSelected === true ? '#edd25a' : 'white', borderRadius: 10, marginHorizontal: 20, borderColor: 'gray', borderWidth: 2, flexDirection: 'row', alignItems: 'center', padding: 10 }}>
            <Text style={{ flex: 1 }}>{props.data.item.description}</Text>
            <Image source={ImageResource.icoPig} style={{ height: 38, width: 38 }} resizeMode='contain' />
        </TouchableOpacity>
    );
}
export default Quizz;
