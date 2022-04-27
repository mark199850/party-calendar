import React, { useState } from "react";
import { View, Text, Platform, TextInput, KeyboardAvoidingView, ScrollView, Image, Dimensions, StyleSheet, TouchableHighlight, TouchableOpacity, Pressable, FlatList } from "react-native";
import { actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import MaskInput, { Masks } from 'react-native-mask-input';
import DropDownPicker from 'react-native-dropdown-picker';

const ArticleDataForm = () => {

	//const richText = React.useRef();
    
    const [userId, setUserId] = useState('');
    const [articleName, setArticleName] = useState('');
    const [articleImg, setArticleImg] = useState('');
    const [articleDate, setArticleDate] = useState('');
    const [settlement, setSettlement] = useState('');
    const [articleCreatedAt, setArticleCreatedAt] = useState('');
    const [articleUpdatedAt, setArticleUpdatedAt] = useState('');
    const [searchedStr, setSearchedStr] = useState('');
    
    AsyncStorage.getItem('id').then((id) => {
        setUserId(id);
    })

    const showToast = (type,text1,text2) => {
        Toast.show({
            type: type,
            text1: text1,
            text2: text2,
            position: 'bottom'
        });
    }

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

  //dropdownPicker
    const fetchSettlements = (str) => {
        fetch(`${global.NodeJS_URL}/api/get/settlements`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'searchedStr': str,
            }
            })
        .then(async res => { 
            try {
                if (res.status !== 200) {
                // console.log('not200');
                const jsonRes = await res.json();
                } else {
                    const jsonRes = await res.json();
                    setItems(jsonRes);                }
            } catch (err) {
            // console.log(err);
            };
        })
        .catch(err => {
        //   console.log(err);
        });
        setOpen(true);
    }

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

    const Submit = () => {
        if( articleName == '' || articleDate == '' || settlement == '' ) {
            showToast('info','Info','Please fill all the required fields');
        }else{
            setArticleCreatedAt(getCurrentDate());
            setArticleUpdatedAt(getCurrentDate());
            const payload = {
                userId,
                articleName,
                articleImg,
                articleDate,
                settlement,
                articleCreatedAt,
                articleUpdatedAt
            };
            fetch(`${global.NodeJS_URL}/api/insert/article/byId`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            })
            .then(async res => { 
                try {
                    if (res.status !== 200) {
                    // console.log('not200');
                    const jsonRes = await res.json();
                    showToast('error','Error',jsonRes.message);
                    } else {
                        const jsonRes = await res.json();
                        showToast('success','Success',jsonRes.message);
                        //console.log(jsonRes);
                    }
                } catch (err) {
                // console.log(err);
                };
            })
            .catch(err => {
            //   console.log(err);
            });
        }

       // console.log(userId+articleName+articleSmDescr+articleMDescr);
    }
    return(
        <View style={styles.container}>
            <View style={styles.formContainer}>
            <View>
                
                <Text style={styles.label}>Title/Name: {articleName.length}/100</Text>
                <TextInput style={styles.input} onChangeText={setArticleName} maxLength={100} autoCapitalize="none"></TextInput>
                
                <Text style={styles.label}>Image (Leave it empty to use the default picture): {articleImg.length}/1000</Text>
                <TextInput style={styles.inputMultiline} onChangeText={setArticleImg} maxLength={1000} multiline={true} autoCapitalize="none"></TextInput>
                
                <Text style={styles.label}>Date:</Text>
                <MaskInput style={styles.input} value={articleDate} onChangeText={(masked, unmasked) => {setArticleDate(masked)}}       mask={Masks.DATE_YYYYMMDD/*[/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]*/}/>
                
                <Text style={styles.label}>Settlement:</Text>
                <DropDownPicker
                    open={open}
                    setOpen={setOpen}
                    value={settlement}
                    items={items}
                    setValue={setSettlement}
                    /*onChangeValue={(value) => {
                        setArticleSettlement(value);
                      }}*/
                    setItems={setItems}
                    searchable={true}
                    disableLocalSearch={true}
                    searchTextInputProps={{
                        value: searchedStr,
                        onChangeText: (text) => {fetchSettlements(text), setSearchedStr(text)}
                      }}
                    onSelectItem={(item) => {setOpen(false), setSettlement(item)}}
                />
                {/* <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}	style={{ flex: 1 }}> */}
            </View>
            </View>
            <View style={styles.submitBtnContainer}>
                <TouchableHighlight style={styles.submitBtn} /*onPress={() => {}}*/ onPress={Submit} underlayColor={'#32302a'}>
                    <Text style={styles.submitBtnText}>Apply</Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:13,
        paddingHorizontal: 10,
        backgroundColor: "#f2f1e1",
    },
    formContainer: {
        flex: 1,
        borderRadius: 10,
        overflow: 'hidden',
    },
    label: {
        color: '#4d4a42',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        paddingTop: 10,
        fontSize: 16, 
        minHeight: 40,
        color: 'black',
        backgroundColor: 'white',
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 20,
        paddingLeft: 10,
    },
    inputMultiline: {
        width: '100%',
        paddingTop: 10,
        fontSize: 16, 
        minHeight: 40,
        color: 'black',
        backgroundColor: 'white',
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 20,
        paddingLeft: 10,
    },
    submitBtnContainer : {
        padding: 10,
        backgroundColor: "#f2f1e1",
    },
    submitBtn: {
        height: 50,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: '#4d4a42',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    submitBtnText: {
        color: 'white',
        fontSize: 20,
    },
});

export default ArticleDataForm