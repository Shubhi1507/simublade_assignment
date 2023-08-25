import {View, Text, Image, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from '../components/Button';
import {ROUTES} from '../navigation/routes.constant';
import {TextHandler} from '../components/TextHandler';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {authFB} from '../api/firebase.api';
import ACTION_CONSTANTS from '../redux/action/action';

export default function DashboardScreen({navigation, route}) {
  const store = useSelector(s => s.authReducer);
  const dispatch = useDispatch();
  const [name, setName] = useState('');

  useEffect(() => {
    // dispatch({type: ACTION_CONSTANTS.RESET_APP});
    console.log('store', store.userData);
  }, []);
  async function signOut() {
    if (store?.userData?.via === 'google') {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        dispatch({type: ACTION_CONSTANTS.RESET_APP});
        navigation.reset({index: 0, routes: [{name: ROUTES.AUTH.LOGINSCREEN}]});
      } catch (error) {
        Alert.alert('Something else went wrong... ', error.toString());
      }
    }
    if (store?.userData?.via === 'email') {
      try {
        await authFB().signOut();
        dispatch({type: ACTION_CONSTANTS.RESET_APP});
        navigation.reset({index: 0, routes: [{name: ROUTES.AUTH.LOGINSCREEN}]});
      } catch (error) {
        if (error.constructor == String) {
          return Alert.alert('Error', error.toString());
        }
      }
    }
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', backgroundColor: 'white'}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TextHandler
          style={{
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: 20,
            color: 'black',
            margin: 8,
            textAlign: 'center',
            // borderWidth : 1,
          }}>
          Welcome , {store?.userData?.name}
        </TextHandler>

        {store?.userData?.photo ? (
          <Image
            style={{
              height: 100,
              width: 100,
              borderRadius: 50,
              alignItems: 'center',
            }}
            source={{uri: store?.userData?.photo}}
          />
        ) : (
          <Image
            style={{height: 100, width: 100, borderRadius: 50}}
            source={require('../assets/user.png')}
          />
        )}
      </View>

      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {!store?.userData?.verified ? (
          <Button
            title={'Verify Phone number'}
            onPress={() => navigation.navigate(ROUTES.AUTH.VERIFYPHONE)}
            ButtonContainerStyle={{
              borderBottomWidth: 1,
              borderBottomColor: 'red',
            }}
          />
        ) : (
          <Button
            title={'Verified'}
            onPress={() => {}}
            ButtonContainerStyle={{
              borderBottomWidth: 1,
              borderColor: 'green',
            }}
          />
        )}

        <Button
          title={'LOGOUT'}
          onPress={() =>
            Alert.alert('Confirm logout', '', [
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
              },
              {text: 'OK', onPress: () => signOut()},
            ])
          }
          ButtonContainerStyle={{
            marginVertical: 20,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'orange',
          }}
        />
      </View>
    </View>
  );
}
