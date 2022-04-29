import React, { useState, useRef, useContext } from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import Animated, { useSharedValue, useAnimatedStyle, Easing, withSpring, withTiming } from 'react-native-reanimated';

const Footer = ({searchArticle}) => {
    let screenWidth = Dimensions.get('window').width;
    const [search, setSearch] = useState(false);
    const [searchText, setSearchText ] = useState('');
    const [animate, setAnimate] = useState(false);

    const articleStylesForNextAnimation = useRef({width:0,borderRadius: 10});

    const animation = useSharedValue(articleStylesForNextAnimation.current);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            width: withTiming(animation.value.width,{
                duration:300,
                easing: Easing.bezier(0.6, 0.30, 0, 1),
            }),

            borderRadius: withTiming(animation.value.borderRadius,{
                delay:100,
                duration:300,
                easing: Easing.bezier(0.6, 0.23, 0, 1),
            }),
        };  
    });

    const toggleSearchBar = (bool) => {

        setAnimate(true);

        if ( bool == false) {
            [
                animation.value = {width: 0, borderRadius: 10},
                articleStylesForNextAnimation.current = {width: 0, borderRadius:10},
            ]
        }else{
            [
                animation.value = {width:screenWidth-60, borderRadius:0},
                articleStylesForNextAnimation.current = {width:screenWidth-60, borderRadius:0},
            ]
        }
        //setAnimate(false);

        setSearch(bool);
        if (bool == false ) {
            searchArticle('');
        }
    }

    const showToast = (type,text1,text2) => {
        Toast.show({
            type: type,
            text1: text1,
            text2: text2,
            position: 'bottom'
        });
    }





    return(
        <View style={styles.FooterContainer}>
            <Animated.View style={[styles.AnimatedView, animate == true && animatedStyles]}>
                    <TextInput style={[styles.TextInput, ]} onChangeText={(text) => {searchArticle(text), console.log(text)}} placeholder="Search" placeholderTextColor = 'lightgrey' autoCapitalize="none"></TextInput>
            </Animated.View>
                    <TouchableOpacity 
                        underlayColor={'rgba(0,0,0,0.3)'}
                        style={styles.button}
                        onPress={() => toggleSearchBar(!search)}>
                            {search == true ?
                                <MaterialCommunityIcons name="window-close" color={'#1378b0'} size={40} />
                            :
                                <MaterialCommunityIcons name="magnify" color={'#1378b0DD'} size={40} />
                            }
                    </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    FooterContainer: {
        position: "absolute",
        alignSelf: 'center',
        bottom: 0,
        //width: 50,
        flexDirection: "row",
        height: 60,
        color: '#4d4a42',
        backgroundColor: '#000000AA',//'#cec8b0',
        borderRadius: 10,
    },
    AnimatedView: {
        width:0,
    },
    TextInput: {
        flex: 5,
        //justifyContent: 'center',
        fontSize: 25,
        paddingBottom:3,
        alignItems: 'center',
        flexDirection: "row",
        paddingLeft: 10,
        color: 'lightgrey',
        margin:0,
        //backgroundColor: 'white',
        borderRadius: 10,
        margin: 10,
        //textAlign: 'center',
    },
    Text: {
        flex: 5,
        //justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        paddingLeft: 10,
        fontSize: 40,
        color: '#4d4a42',
        margin:0,
        //textAlign: 'center',
    },

    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        borderRadius: 100,
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        borderRadius: 100,
        marginHorizontal: 10,
    },
});

export default Footer