import React, { useState, useEffect, useMemo, useCallback, useContext, useRef } from "react";
import { View, ScrollView, Text, Dimensions, StyleSheet, TouchableOpacity, FlatList, ImageBackground } from "react-native";
//import ScrollableModal from "../globals/ScrollableModalWithRef";
import { PanelHandlerContext } from "../globals/Context";
import { requestCameraPermission, requestStoragePermission } from "../globals/PermRequests";
import * as ImagePicker from 'react-native-image-picker';
import Animated, { useSharedValue, useAnimatedStyle, Easing, withSpring, withTiming } from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FastImage from 'react-native-fast-image'
import { useFocusEffect } from '@react-navigation/native';
import ContentLoader, { Facebook, Circle, Rect } from 'react-content-loader/native'
import Toast from 'react-native-toast-message';

//import 'react-native-gesture-handler';
//import { createGlobalState } from 'react-hooks-global-state';


//const initialState = { scrollUnlock: true };
//const { useGlobalState } = createGlobalState(initialState);

var flatListHeight = 0;
var globalRef = null;
var lastFetchedArticleItemId = 1;
var articleData = [];
var articleId = null;
var scrollOffsetVar = "0";
var userId = null;
var found = false;

const Articles = ({searchedStr}) => {

    //Toast message
    const showToast = (type,text1,text2) => {
        Toast.show({
          type: type,
          text1: text1,
          text2: text2,
          position: 'bottom'
        });
    }

    //swipepanel
  /*  const [panelProps, setPanelProps] = useState({
        fullWidth: true,
        openLarge: true,
        showCloseButton: true,
        zIndex : 100,
        onClose: () => closePanel(),
        onPressCloseButton: () => closePanel(),
        style: styles.comments,
        // ...or any prop you want
    });*/
    const [isModalVisible, setModalVisible] = useState(false);
    const [content, setContent] = useState('');
    const modalRef = useRef();
    const panelHandlerContext = useMemo(() => ({
        openPanel: (id,content) => {
            articleId = id;
            setContent(content);
            //console.log(isModalVisible);
        },
         closePanel: () => {
            modalRef.current.close();
            setContent('');
        },
        saveToFavorites: (articleId) => {
            AsyncStorage.getItem('id').then((id) => {
                userId = id;
                const payload = {
                    userId,
                    articleId
                };
                fetch(`${global.NodeJS_URL}/api/insert/favorite`, {
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
                        }else{
                            const jsonRes = await res.json();
                            showToast('success','Success',jsonRes.message);
                        }
                    } catch (err) {
                        if (data == ''){ //if there isn't already loaded results
                            setIsLoading(false);
                            showToast('error','Error',err.toString());
                        }
                        //console.log(err);
                    };
                })
                .catch(err => {
                    if (data == ''){ //if there isn't already loaded results
                        setIsLoading(false);
                        showToast('error','Error',err.toString());
                    }
                    //console.log(err);
                });
            });
        },
    }));

    useEffect(() => { 
        if (content != ""){
        modalRef.current.open();
        }
    }, [content]);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
      };



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
    const flatlistRef = useRef();
    const [data, setData] = useState ([]);
    const [getArticleData, setArticleData] = useState([]);
    const [getLastFetchedArticleItemId, setLastFetchedArticleItemId] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    useEffect(() => { 
        AsyncStorage.getItem('id').then((id) => {
            if (searchedStr != ''){
                setIsSearch(true);
                fetchMore(true,true,searchedStr)
            }else{
                fetchMore(true);
            }
        });
    }, [searchedStr]);

    
    const fetchMore = (refreshing, isSearch, searchedStr) => {
        if (refreshing == true) {
            setIsLoading(true);
            lastFetchedArticleItemId = 1;
            //setArticleData([]);////state-es articledata-hoz
            articleData = [];
            setData([]);
        }
        if (isSearch){

            fetch(`${global.NodeJS_URL}/api/get/mobile/article/search`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'item' : lastFetchedArticleItemId,
                    'searchedString' : searchedStr,
                },
            })
            .then(async res => { 
                try {
                    if (res.status !== 200) {
                        const jsonRes = await res.json();
                        found=false;
                        setIsLoading(false);
                        if (data == ''){ //if there isn't already loaded results
                            showToast('error','Error',jsonRes.message);
                        }
                    } else {
                        setIsLoading(false);
                        const jsonRes = await res.json();
                        found=true;
                        var articleResultId = 0;
                        //let adata = [...getArticleData]; //state-es articledata-hoz
                        if (articleData.length != 0 && articleData.length % 20 != 0 ){

                        }else{
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
                        //console.log(data);
                        //console.log(articleData);
                        }
                    }
                } catch (err) {
                    if (data == ''){ //if there isn't already loaded results
                        setIsLoading(false);
                        showToast('error','Error',err.toString());
                    }
                    //console.log(err);
                };
            })
            .catch(err => {
                if (data == ''){ //if there isn't already loaded results
                    setIsLoading(false);
                    showToast('error','Error',err.toString());
                }
                //console.log(err);
            });



        }else{



            fetch(`${global.NodeJS_URL}/api/get/article`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'item' : lastFetchedArticleItemId,
                },
            })
            .then(async res => { 
                try {
                    if (res.status !== 200) {
                        const jsonRes = await res.json();
                        found=false;
                        setIsLoading(false);
                        if (data == ''){ //if there isn't already loaded results
                            showToast('error','Error',jsonRes.message);
                        }
                    } else {
                        setIsLoading(false);
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
                        //console.log(data);
                        //console.log(articleData);
                    }
                } catch (err) {
                    if (data == ''){ //if there isn't already loaded results
                        setIsLoading(false);
                        showToast('error','Error',err.toString());
                    }
                    //console.log(err);
                };
            })
            .catch(err => {
                if (data == ''){ //if there isn't already loaded results
                    setIsLoading(false);
                    showToast('error','Error',err.toString());
                }
                //console.log(err);
            });


        }

    };

    //ScrollToIndex
    const scrollToIndex = (cardNumber) => {
        if ( flatlistRef.current != null ) {
            flatlistRef.current.scrollToIndex({
                animated: true,
                index: cardNumber,
                viewPosition: 0
            })
        }
    }

    //ScrollOffset
    const ScrollToOffset = (o,a) => {
        if ( flatlistRef.current != null ) {
            flatlistRef.current.scrollToOffset({
                animated: a,
                offset: Number(o)
            })
        }
    }

    //get scroll position
    onScroll = (event) => {
        scrollOffsetVar = event.nativeEvent.contentOffset.y;
    }

    //save and restore scroll position
    useFocusEffect(

        React.useCallback(() => {
            AsyncStorage.getItem('scrollOffsetHome').then((offset) => {
                ScrollToOffset(offset,false);
            })

        return () => {
            AsyncStorage.setItem('scrollOffsetHome', scrollOffsetVar.toString());
        };

    }, []));

    //lock scroll if zoomed
    const scrollUnlock = useRef(true);

    const [getScrollUnlock, setScrollUnlock] = useState(true);

    const switchScrollUnlock = (bool) => {
        setScrollUnlock(bool);
       //scrollUnlock.current = bool;
      // console.log(scrollUnlock.current);
    }


    //render the cards
    const renderItem = useCallback(
        ({item}) => (
            <> 
                <Text style={styles.emptycard}></Text>
                { isLoading == false && articleData[item-1] != [] && articleData[item-1] != undefined/* && articleData[item-1].ArticleStatus == 1*/ ? 
                    <Article item={item} scrollToIndex={scrollToIndex} switchScrollUnlock={switchScrollUnlock} /*data={getArticleData}*//>
                : null} 
            </>


        ),
    []);

    //const keyExtractor = useCallback((item) => item.toString(),[])
    const keyExtractor = useCallback(e => e,[]);

    const find_dimesions = (layout) => {
        const {x, y, width, height} = layout;
        flatListHeight = height;
      }
    return(
        <PanelHandlerContext.Provider value={panelHandlerContext}>
        <View style={styles.container} onLayout={(event) => { find_dimesions(event.nativeEvent.layout) }}>
        {/* <ScrollableModal isVisible={isModalVisible} onSwipeComplete={toggleModal} articleId={articleId}/> */}
       {/*   <ScrollableModal /*isVisible={isModalVisible}*//* onSwipeComplete={() => {setContent('')}} id={/*"0CaIwAncmpgZtxjBTM4pF"*//*articleId} content={content} ref={modalRef}/>*/}
        { isLoading && <><LoadingPlaceholder style={{flex: 1}}/><LoadingPlaceholder style={{flex: 1}}/></> }
            <FlatList
                scrollEnabled = {getScrollUnlock}
                data={data}
                ref={flatlistRef /*(ref) => {
                    globalRef = ref;
                  }*/}
                onScroll={onScroll}
                onEndReachedThreshold={2}
                onEndReached={() => fetchMore(false, isSearch, searchedStr)}
                style={{flex: 1}}
                //removeClippedSubviews = {false}
                //updateCellsBatchingPeriod = {10}
                initialNumToRender = {2}
                maxToRenderPerBatch={3}
                windowSize={5}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onRefresh={() => fetchMore(true, isSearch, searchedStr)}
                refreshing={false}
                getItemLayout={(data, index) => (
                    {length: 515, offset: 515 * index, index}
                    )}
                /*ListHeaderComponent={this.renderHeader}*/
                />
        </View>
        </PanelHandlerContext.Provider>
    )
}

const LoadingPlaceholder = () => (
    <ContentLoader foregroundColor="#ada585"/*"#9b957d"*/ backgroundColor="#b8b094"/*"#ada585"*/ width="100%" height="500">
        <Circle cx="10%" cy="7%" r="4%" />
        <Rect x="20%" y="6%" rx="1" ry="1" width="20%" height="2%" />

        <Rect x="3%" y="12%" rx="10" ry="10" width="94%" height="75%" />

        <Rect x="22%" y="91%" rx="5" ry="5" width="8%" height="5%" />
        <Rect x="70%" y="91%" rx="5" ry="5" width="8%" height="5%" />

    </ContentLoader>
  )

class Article extends React.PureComponent {    

    render() {

        const {item} = this.props;
        const {scrollToIndex} = this.props;
        const {switchScrollUnlock} = this.props;

        //const {data} = this.props;
        return(
            <ArticleFunc item={item} scrollToIndex={scrollToIndex} switchScrollUnlock={switchScrollUnlock}/*data={data[item-1]}*//>
        )
    }
}

/*
const Article = ({item,data}) => {
    console.log("data: " + data);
    return(
        <ArticleFunc item={item}/>
)}*/

const ArticleFunc = ({item, data, scrollToIndex, switchScrollUnlock}) => {

    item=item-1;
    
    //const PostProps = [{postId: getPostId}, {userId:getUserId}, {postTitle:getPostTitle}, {postDescription:getPostDescriprion}, {postImgUri: getPostImgUri}, {createdAt: getPostCreatedAt}];
    //const PostProps = [{postId: 1}, {userId:1}, {postTitle:'title'}, {postDescription:'Desc'}, {postImgUri: 'https://images.unsplash.com/photo-1544526226-d4568090ffb8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by'}, {createdAt: '2020.12.12.'}];

    //const [getScrollUnlock, setScrollUnlock] = useGlobalState('scrollUnlock');

    const [getArticleData, setArticleData] = useState([articleData[item].Settlement, articleData[item].ArticleDate]);
    
    const [getIfZoomed, setIfZoomed] = useState(false);

    const [animate, setAnimate] = useState(false);
    //const [getArticleStylesForNextAnimation, setArticleStylesForNextAnimation] = useState({height:500, padding: 10, paddingTop:5, borderRadius: 10})
    const articleStylesForNextAnimation = useRef({height:500, padding: 10, paddingTop:5, borderRadius: 10});

    const animation = useSharedValue(articleStylesForNextAnimation.current);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            height: withTiming(animation.value.height,{
                duration:500,
                easing: Easing.bezier(0.6, 0.30, 0, 1),
            }),

            padding: withTiming(animation.value.padding,{
                delay:100,
                duration:800,
                easing: Easing.bezier(0.6, 0.23, 0, 1),
            }),

            paddingTop: withTiming(animation.value.paddingTop,{
                delay:100,
                duration:1000,
                easing: Easing.bezier(0.6, 0.23, 0, 1),
            } , (finished) => {
               /* console.log(finished)
                scrollToIndex(item),
                switchScrollUnlock(!getIfZoomed)*/
            }),

            borderRadius: withTiming(animation.value.borderRadius,{
                delay:100,
                duration:500,
                easing: Easing.bezier(0.6, 0.23, 0, 1),
            }),
        };  
    });

    const ZoomIt = ({data}) => {
        setAnimate(true);
        if ( getIfZoomed == false) {
            [
                animation.value = {height: flatListHeight, padding:0, marginBottom: 0, paddingTop:0, borderRadius: 0},
                //setArticleData([data.ArticleImg, data.ArticleName, data.ArticleMDescr]),
                setArticleData([articleData[item].Settlement, articleData[item].ArticleDate]),
                //setArticleStylesForNextAnimation({height: flatListHeight, padding:0, paddingTop:0, borderRadius:0}),
                articleStylesForNextAnimation.current = {height: flatListHeight, padding:0, paddingTop:0, borderRadius:0},
                setIfZoomed(true),
                //setScrollUnlock(false),
                switchScrollUnlock(false),
            ]
        }else{
            [
                animation.value = {height:500, padding: 10, marginBottom: 15, paddingTop:5, borderRadius:10},
                //setArticleData([data.ArticleImg, data.ArticleName, data.ArticleSmDescr]),
                setArticleData([articleData[item].Settlement, articleData[item].ArticleDate]),
                //setArticleStylesForNextAnimation({height:500, padding: 10, paddingTop:5, borderRadius:10}),
                articleStylesForNextAnimation.current = {height:500, padding: 10, paddingTop:5, borderRadius:10},
                setIfZoomed(false),
                //setScrollUnlock(true),
                switchScrollUnlock(true),
            ]
        }
    }

    return (
        
        <>

            <Animated.View  style={[styles.articleContainer, animate == true && animatedStyles]}>
                <ArticleHeader props={[articleData[item].UserPP, articleData[item].UserUn, articleData[item].UserId]}/>
                <TouchableOpacity activeOpacity={0.9} style={styles.articleBodyContainer} onPress={() => ([ZoomIt({data}), scrollToIndex(item) /*globalRef.scrollToIndex({
            animated: true,
            index: item,
            viewPosition: 0
          })*/    ])}>    
                    <ArticleBody
                      //  onLayout={(event) => {this.find_dimension(event.nativeEvent.layout)}}
                        props={[articleData[item].ArticleImg, articleData[item].ArticleName, getArticleData[0], getArticleData[1], getArticleData[2], getIfZoomed]}
                        />
                </TouchableOpacity>
                <ArticleFooter props={[articleData[item].ArticleId]}/>
            </Animated.View>

        </>           
        
    

    )
}

const ArticleHeader = ({props}) => {
const { openPanel } = useContext(PanelHandlerContext);
    return (
        <TouchableOpacity activeOpacity={0.5} style={styles.articleHeaderContainer} onPress={() => {openPanel(props[2],'profile')}}>
            <View style={styles.articleHeaderImgContainer} >
                <FastImage source={{uri: props[0]}} style={styles.articleHeaderImg} />
            </View>
            <View style={styles.articleHeaderUNameContainer}>
                <Text style={styles.articleHeaderUName}>
                    {props[1]}
                </Text>       
            </View>
        </TouchableOpacity>
    );
}

const ArticleBody = ({props}) => {
    //const BASE_URI = 'https://source.unsplash.com/random?sig=';
    return(
            <ImageBackground 
            source={{uri: props[0] /*pickedImagePath/*/}} 
            style={styles.articleBodyContainer}
            imageStyle={{ borderRadius: 10}}
        >
            <Text style={styles.articleBodyHeader}>{props[1]}</Text>
            { props[5] === false ?
                <View style={styles.articleBodyFooter} onStartShouldSetResponder={() => false}>

                    <Text style={styles.articleBodyFooterLabel} onStartShouldSetResponder={() => true}>Location:</Text>
                    <Text style={styles.articleBodyFooterText} onStartShouldSetResponder={() => true}>{props[2]}</Text>

                    <Text style={styles.articleBodyFooterLabel} onStartShouldSetResponder={() => true}>Date:</Text>
                    <Text style={styles.articleBodyFooterText} onStartShouldSetResponder={() => true}>{props[3]}</Text>   
 
                </View>
            :
                <ScrollView style={styles.articleBodyFooter}  onStartShouldSetResponder={() => true}>
                    <View onStartShouldSetResponder={() => true}>
                    <Text style={styles.articleBodyFooterText} >{props[2]}</Text></View>
                </ScrollView>
            }
        </ImageBackground>
   
    );
}

const ArticleFooter = ({props}) => {
const { openPanel, saveToFavorites } = useContext(PanelHandlerContext);
    return(
    <View style={styles.articleFooter}>
        <TouchableOpacity activeOpacity={0.5} style={styles.articleFooterBtnContainer}/* underlayColor={'rgba(0,0,0,0.3)'} */onPress={() => {saveToFavorites(props[0])}}>
            {/* <FastImage source={require("../../public/images/star.png")} style={styles.articleFooterBtnImg}/> */}
            <MaterialCommunityIcons name="star" color="#DDDDDDDD" size={34} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.5} style={styles.articleFooterBtnContainer} /*underlayColor={'rgba(0,0,0,0.3)'}*/ onPress={() => {openPanel(props[0],'comments')}}>
            <MaterialCommunityIcons name="comment" color="#DDDDDDDD" size={30} />
            {/* <FastImage source={require("../../public/images/chat-bubble.png")} style={styles.articleFooterBtnImg}/> */}
        </TouchableOpacity>                    
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 13,
        backgroundColor:  '#000000BB',//'#8aacc8', //"#cec8b0",
        //paddingTop: getStatusBarHeight(),
        //borderRadius: 10,
        overflow: "hidden",
    },
    articleContainer: {
        height: 500, //Dimensions.get('window').height*0.6 set it at animation too
        backgroundColor: '#00000000',//#f2f1e1',
        borderRadius: 10,
        marginBottom: 15,
        padding: 10,
        paddingBottom: 10, //overrides the animation of "padding"
        paddingTop: 5,
        marginTop: -1,
    },
        articleHeaderContainer: {
            //flex:1,
            flexDirection:'row',
            height: 50,
            padding: 10,
        },
            articleHeaderImgContainer:{
                flex:1,
                //backgroundColor: 'red',
            },
            articleHeaderImg:{
                aspectRatio: 1,
                height:'100%',
                flex: 1,
                borderRadius: 10000,
            },
            articleHeaderUNameContainer: {
                flex:5,
               // backgroundColor: 'yellow',
                justifyContent: 'center',
            },
            articleHeaderUName: {
                justifyContent: 'center',
                fontWeight:'bold',
                color: 'lightgrey',
            },
        articleBodyContainer:{
            //aspectRatio : 1,
            width: '100%',
            borderRadius: 20,
            flex:10,
            marginBottom: 5,
        },
            articleBodyHeader: {
                //flex:1,
                marginBottom : 150,
                fontSize: 25,
                backgroundColor: 'rgba(0,0,0,0.80)',
                color: 'lightgrey',
                paddingLeft: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
            },
            articleBodyFooter: {
                flex:1,
                fontSize: 15,
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: 'lightgrey',
                paddingLeft: 20,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
            },
                articleBodyFooterLabel: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'lightgrey',
                    marginTop: 20,
                },
                articleBodyFooterText: {
                    fontSize: 30,
                    color: 'lightgrey',
                },
        articleFooter: {
            //flex:1,
            flexDirection: 'row',
            //height: 30,
            justifyContent: 'space-between',
        },
            articleFooterBtnContainer:{
                alignItems: 'center',
                justifyContent: 'center',
                flex:1,
             },
             articleFooterBtnImg:{
                 aspectRatio : 1,
                 height: 40,
                // backgroundColor: 'red'
             },
    button_text:{
        color: '#ffffff',
        fontSize: 20,
    },
    emptycard: {
        height: 1,
    },
});
    

export default Articles