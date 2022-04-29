import React, {useContext } from "react";
import { View, Text, Image,StyleSheet, Dimensions,useWindowDimensions } from "react-native";
import { getStatusBarHeight } from 'react-native-status-bar-height';

import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

function Header () {
    const windowHeight = useWindowDimensions().height;

    return(
        <View style={styles.HeaderContainer}>
<MaskedView
                        style={{ height: 80 }}
                        maskElement={
                        <View
                            style={{
                            // Transparent background because mask is based off alpha channel.
                            backgroundColor: 'transparent',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            }}
                        >
                            <Text
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            style={{
                                fontSize:50,
                                color: 'black',
                                fontWeight: 'bold',
                                paddingHorizontal: 20
                            }}
                            >
                            CREATE PARTY
                            </Text>
                        </View>
                        }
                    >
                        <Image source={require('../../images/loginbg.jpg')}  style={{width:Dimensions.get('screen').width, height:Dimensions.get('screen').height, top: -getStatusBarHeight()-60, left: -10}}/>
                    </MaskedView>
            {/* <Text style={styles.Text}>CREATE NEW PARTY</Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    HeaderContainer: {
        padding: 10,
        backgroundColor: '#000000BB',//'#cec8b0',
    },
    Text: {
        //justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 35,
        fontWeight: 'bold',
        color: "#000000",//'lightgrey',//'#4d4a42',
        margin:0,
        //textAlign: 'center',
    },
});

export default Header