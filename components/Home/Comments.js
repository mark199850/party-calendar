import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, } from "react-native";
import { requestCameraPermission, requestStoragePermission } from "../globals/PermRequests";
import * as ImagePicker from 'react-native-image-picker';
import FastImage from 'react-native-fast-image'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContentLoader, { Facebook, Circle, Rect } from 'react-content-loader/native'
import Toast from 'react-native-toast-message';


var lastFetchedArticleItemId = 1;
var articleData = [];
var commentCreatedAt = '';
var userId = '';

const Comments = ({articleId}) => {

    //Toast message
    const showToast = (type,text1,text2) => {
        Toast.show({
          type: type,
          text1: text1,
          text2: text2,
          position: 'bottom'
        });
    }

    const [comment, setComment ] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    AsyncStorage.getItem('id').then((id) => {
        userId = id;
    })


    const getCurrentDate=()=>{

        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var hours = new Date().getHours();
        var minutes = new Date().getMinutes();
        var seconds = new Date().getSeconds();
  
        //Alert.alert(date + '-' + month + '-' + year);
        // You can turn it in to your desired format
        return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;//format: dd-mm-yyyy;
    }


    const Submit = () => {
        if ( comment != '' ) {
            commentCreatedAt = getCurrentDate();
            const payload = {
                userId,
                articleId,
                comment,
                commentCreatedAt
            };
            fetch(`${global.NodeJS_URL}/api/insert/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
            .then(async res => { 
                try {
                    if (res.status !== 200) {
                        const jsonRes = await res.json();
                        showToast('error','Error',jsonRes.message);

                    } else {
                        setIsLoading(true);
                        setComment('');
                        fetchMore(true);
                        //console.log(jsonRes);
                    }
                } catch (err) {
                        showToast('error','Error',err.ToString());
                // console.log(err);
                };
            })
            .catch(err => {
                    showToast('error','Error',err.toString());
            //   console.log(err);
            });
        }
    }

    //ImagePicker RN

    const [pickerResponse, setPickerResponse] = useState(null);

    const onImageLibraryPress = useCallback(() => {
        requestStoragePermission();
        const options = {
        selectionLimit: 1,
        mediaType: 'photo',
        includeBase64: false,
        };
        ImagePicker.launchImageLibrary(options, setPickerResponse);
    }, []);

    const onCameraPress = useCallback(() => {
        requestCameraPermission();
        const options = {
        saveToPhotos: true,
        mediaType: 'photo',
        includeBase64: false,
        };
        ImagePicker.launchCamera(options, setPickerResponse);
    }, []);

    const uri = pickerResponse?.assets && pickerResponse.assets[0].uri;

    
    //imagePicker
    const [pickedImagePath, setPickedImagePath] = useState('');

    //infiniteScroll
    const [data, setData] = useState ([]);
    const [getArticleData, setArticleData] = useState([]);
    const [getLastFetchedArticleItemId, setLastFetchedArticleItemId] = useState(1);
    useEffect(() => {
        lastFetchedArticleItemId = 1;
        //setArticleData([]); ////state-es articledata-hoz
        articleData = [];
        setData([]);
        fetchMore();
    }, []);

    const fetchMore = (refreshing) => {
        if (refreshing == true) {
            lastFetchedArticleItemId = 1;
            //setArticleData([]);////state-es articledata-hoz
            setData([]); 
            articleData = [];
        }

        fetch(`${global.NodeJS_URL}/api/get/comments/byId`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'item' : lastFetchedArticleItemId,
                'articleId' : articleId
            },
        })
        .then(async res => { 
            try {
                if (res.status !== 200) {
                    const jsonRes = await res.json();
                    //console.log("err1");
                    setIsLoading(false);
                    if (data == ''){ //if there isn't already loaded results
                        showToast('error','Error',jsonRes.message);
                    }
                    found=false;
                } else {
                    const jsonRes = await res.json();

                    found=true;
                    var articleResultId = 0;
                    //let adata = [...getArticleData]; //state-es articledata-hoz
                    for (articleResultId = 0; articleResultId < jsonRes.length; articleResultId++){
                        //adata.push(jsonRes[articleResultId]); //state-es articledata-hoz
                        articleData.push(jsonRes[articleResultId]);
                    };
                        //setArticleData(adata);//,()=> 		console.log("setState completed", this.state)); //state-es articledata
                    setData(prevState =>[
                        ...prevState,
                        ...Array.from({length:articleResultId}).map((_,articleResultId)=>articleResultId+1 + prevState.length),
                    ]);
                    setLastFetchedArticleItemId(getLastFetchedArticleItemId+jsonRes.length)
                    lastFetchedArticleItemId = lastFetchedArticleItemId +jsonRes.length;
                    setIsLoading(false);
                    //console.log(data);
                    //console.log(articleData);
                }
            } catch (err) {
                if (data == ''){ //if there isn't already loaded results
                    setIsLoading(false);
                    showToast('error','Error',err.toString());
                }
                //console.log("err2 " + err);
            };
        })
        .catch(err => {
            if (data == ''){ //if there isn't already loaded results
                setIsLoading(false);
                showToast('error','Error',err.toString());
            }
            //console.log("err3" + err);
        });        

    };

    const renderItem = useCallback(
        ({item}) => (
            
            <View>
                {/* articleData[item-1] == !undefined && */articleData[item-1] != [] ? 
                <View>
                    <Comment style={styles.CommentContainer} item={item}/>
                </View>
                : null} 
            </View>


        ),
    []);

    //const keyExtractor = useCallback((item) => item.toString(),[])
    const keyExtractor = useCallback(e => e,[]);

    const find_dimesions = (layout) => {
        const {x, y, width, height} = layout;
        flatListHeight = height;
      }
    return(
            <View style={styles.modalContainer} onStartShouldSetResponder={() => false}>
            <View style={styles.headerContainer}>
                <View style={styles.headerPillContainer}>
                    <View style={styles.headerPill}></View>
                </View>
            </View>
            <View style={styles.flatListContainer}>
            { isLoading ? 
                <>
                    <LoadingPlaceholder style={{flex: 1}}/>
                    <LoadingPlaceholder style={{flex: 1}}/>
                    <LoadingPlaceholder style={{flex: 1}}/>
                    <LoadingPlaceholder style={{flex: 1}}/>
                </>
            : data != '' ?
                <FlatList
                    data={data}
                    onEndReachedThreshold={2}
                    onEndReached={() => fetchMore(false)}
                    //removeClippedSubviews = {false}
                    //updateCellsBatchingPeriod = {10}
                    initialNumToRender = {7}
                    maxToRenderPerBatch={3}
                    windowSize={5}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    //onRefresh={() => fetchMore(true)}
                // refreshing={false}
                    /*ListHeaderComponent={this.renderHeader}*/
                />
            :
                <Text style={styles.noCommentsText}>No comments yet</Text>
            }
            </View>
            <View style={styles.footerContainer}>
                <View style={styles.replyContainer}>
                    <TextInput onChangeText={setComment} style={styles.textInput} multiline={true}>{comment}</TextInput>
                    <TouchableOpacity activeOpacity={0.5} style={styles.sendIconContainer} onPress={Submit}>
                        <MaterialCommunityIcons style={styles.sendIcon} name="send" color={"grey"} size={36} />
                    </TouchableOpacity>
                </View>
            </View>

{/*             <Pressable
                    onPress={onCameraPress}
                    style={styles.pressable}
                    >
                    <Text
                        style={styles.button_text}
                    >
                        Upload Photo
                    </Text>
                </Pressable>

                <Pressable
                    onPress={onImageLibraryPress}
                    style={styles.pressable}
                    >
                    <Text
                        style={styles.button_text}
                    >
                        Upload Image
                    </Text>
                </Pressable>
                {
                uri !== '' && <Image 
                    source={{uri: uri}} 
                    style={styles.photoshot}
                />
                } */}
        </View>
    )
}

const LoadingPlaceholder = () => (
    <ContentLoader foregroundColor="#ada585"/*"#9b957d"*/ backgroundColor="#b8b094"/*"#ada585"*/ width="100%" height="80">
        <Circle cx="10%" cy="35%" r="5%" />
        <Rect x="16%" y="28%" rx="1" ry="2" width="20%" height="15%" />

        <Rect x="5%" y="65%" rx="10" ry="2" width="90%" height="15%" />

    </ContentLoader>
  )

class Comment extends React.PureComponent {    

    render() {

        const {item} = this.props;
        //const {data} = this.props;
        return(
            <CommentFunc item={item} /*data={data[item-1]}*//>
        )
    }
}

const CommentFunc = ({item}) => {
    return (
        <View  style={styles.commentContainer}>
            <View style={styles.commentHeaderContainer} >
                <View style={styles.commentHeaderImgContainer} >
                    <FastImage resizeMode={FastImage.resizeMode.contain} source={{uri: articleData[item-1].UserPP}} style={styles.commentHeaderImg} />
                </View>
                <View style={styles.commentHeaderUNameContainer}>
                    <Text style={styles.commentHeaderUName}>
                        {articleData[item-1].UserUn}
                    </Text>
                </View>
            </View>
            <View style={styles.commentBodyContainer}>
                <Text style={styles.commentBodyText}>
                    {articleData[item-1].Comment}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 20,
        flexDirection: "column",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    text: {
        paddingBottom: 10,
        paddingLeft: 10,
    },
    headerContainer: {
        height: 50,
    },
        headerPillContainer: {
            alignContent: 'center',
            flex:1,
            flexDirection: 'row',
            justifyContent: 'center',
            padding: 21,
        },
            headerPill: {
                height: '100%',
                width: '20%',
                backgroundColor: '#4d4a42',
                borderRadius: 10000,
            },
    flatListContainer: {
        flex: 10,
    },
    noCommentsText: {
        color:'#4d4a42',
        alignSelf: 'center',
        fontSize: 30
    },
    commentContainer: {
        padding: 10,
        borderBottomColor: '@4d4a42',
        borderBottomWidth: 1,
    },
    commentHeaderContainer: {
        //flex:1,
        flexDirection:'row',
        justifyContent: 'flex-start',
        height: 35,
        padding: 0,
    },

        commentHeaderImgContainer:{
            flex:1,
            padding:0,
            //backgroundColor: 'red',
        },
        commentHeaderImg:{
            flex: 1,
            borderRadius:100,
            aspectRatio: 1,
        },
        commentHeaderUNameContainer: {
            flex:10,
           // backgroundColor: 'yellow',
            justifyContent: 'center',
        },
        commentHeaderUName: {
            justifyContent: 'center',
            color: '#4d4a42',
            marginLeft: 10,
            fontWeight: 'bold'
        },
    commentBodyContainer: {
    },
        commentBodyText: {
            marginLeft: 30,
            color: 'black',
        },
    footerContainer: {
        flex: 1.5,
        padding: 10,
        backgroundColor: "#f2f1e1",

    },
    replyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    textInput: {
        height: '100%',
        paddingLeft: 20,
        flex: 5,
        color: 'black',
    },
    sendIconContainer:{
        flex:1,
        padding: 0,
        alignItems: 'center',
    },
    sendIcon: {
        margin: 0,
    },
    photoshot:{
        aspectRatio : 1,
        width: '100%',
        borderRadius: 20,
        flex:1,
        marginBottom: 5,
    },
  });
  

export default Comments;