import { BottomModal, SlideAnimation} from 'react-native-modals';
import React, { useState, useEffect, useContext, useCallback } from "react";
import { StyleSheet, View, Dimensions} from "react-native";
import { PanelHandlerContext } from './Context';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import Comments from "../Home/Comments";
import Profile from "../Home/Profile";
import UserDataForm from '../Home/Profile';


export default CustomModal = ({showModal, id, contentprop}) => {
  const [content, setContent] = useState('');
  const { closePanel } = useContext(PanelHandlerContext);

  const [modalState, setModalState] = useState(false); /////open modal/////////////////////
     
      useEffect(() => {
        setContent(contentprop);
        setModalState(showModal);
      }, [showModal]);
    
    return(
        <BottomModal
        visible={modalState}
        /*onDismiss={() => {
          setModalState(false),toggleModal()
        }}*/
        containerStyle={[styles.container,
          content == 'comments' ?
            styles.height400
          : content == 'profile' ?
            styles.heightFull
          :content == 'editProfile' ?
            styles.heightFull
          :
            styles.height400 ]}
        width={0.9}
        overlayOpacity={1}
        rounded
        actionsBordered
        onSwipeOut={() => {setModalState(false), closePanel()}}
        onTouchOutside={() => {setModalState(false), closePanel()}}
        onHardwareBackPress={() => {setModalState(false), closePanel()}}
        swipeDirection={['down']}
        modalAnimation={new SlideAnimation({ slideFrom: 'bottom' })}
      > 
          { content == 'comments' ?
            <View style={styles.height400}><Comments articleId={id}/></View>
          : content == 'profile' ?   
            <View style={styles.heightFull}><Profile userId={id}/></View>
          : content == 'editProfile' &&
            <View style={styles.heightFull}><UserDataForm beginLoadData={true}/></View>
          }
          </BottomModal>
    )
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
   // height: 400,
    backgroundColor: "#f2f1e1",
  },
  height400: {
    height: 400,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  heightFull: {
    color: 'black',
    height: Dimensions.get('window').height - getStatusBarHeight(),
    bottom: 0,
    marginBottom: 0
//    flex: 1,
  }
});
