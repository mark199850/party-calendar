import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, Settings } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AuthScreen, SettingsScreen, HomeScreen, NewArticleScreen, UsersArticlesScreen, UsersFavoritesScreen } from './screens';
import FastImage from 'react-native-fast-image'
import { NavigationContainer } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

const screenOptions = {
    headerShown: false,
}


export const SignedInStack = ({userName,userPP}) => {  
    return (
<NavigationContainer>
      <Tab.Navigator>
     {/*    <Stack.Navigator
         initialRouteName="Home"
        screenOptions={screenOptions}
        >
          <Stack.Screen
            name="Home">
            {props => <HomeScreen {...props} userName={userName} />}
          </Stack.Screen>
          <Stack.Screen
            name="Settings">
            {props => <SettingsScreen {...props} userName={userName} />}
            </Stack.Screen>
        </Stack.Navigator> */} 
          <Tab.Screen
            name="Home"
            //children={props =><HomeScreen {...props}/>}
            component={HomeScreen}
            />
          <Tab.Screen
            name="New Party"
            //children={props =><HomeScreen {...props}/>}
            component={NewArticleScreen}
            />
          <Tab.Screen
            name="My Profile"
            //children={props => <SettingsScreen {...props} userName={userName} userPP={userPP} />}
           component={SettingsScreen}
          />
      </Tab.Navigator>
      </NavigationContainer>
    );
  }


export const SignedOutStack = () => {
  return(

    <AuthScreen />
  )
  
}

const styles = StyleSheet.create({
  icon: {
    aspectRatio: 1,
    height:'100%',
    flex: 1,
    borderRadius: 10000,
  }
});

export default SignedInStack

