import {View, Text, Image, Alert, StyleSheet, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TextHandler} from '../components/TextHandler';
import {screenWidth} from '../utils/dimensions.utils';
import {authFB, db} from '../api/firebase.api';
import {Button} from '../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import ACTION_CONSTANTS from '../redux/action/action';

export default function VerifyPhone({navigation, route}) {
  const [mobile, setMobile] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');
  const store = useSelector(s => s.authReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log('store', store);
  }, []);

  async function signInWithPhoneNumber() {
    try {
      let phone = '+91' + mobile;
      const confirmation = await authFB().signInWithPhoneNumber(phone);
      console.log('cofnri');
      setConfirm(confirmation);
    } catch (error) {
      console.log('error', error);
    }
  }

  async function confirmCode() {
    try {
      let result = await confirm.confirm(code);
      console.log('res', result);
      await updateStatusDocument();
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  async function updateStatusDocument() {
    let uid = store?.userData?.uid;
    const usersRef = db;
    let firestoreDocument = await usersRef.doc(uid).get();
    if (firestoreDocument.exists) {
      usersRef
        .doc(uid)
        .update({verified: true, mobile})
        .then(() => {
          console.log('updated to firestore');
          let pl = {...store?.userData, mobile, verified: true};
          dispatch({type: ACTION_CONSTANTS.LOGIN_DATA_UPDATE, payload: pl});
          navigation.pop();
        })
        .catch(error => {
          Alert.alert(JSON.stringify(error.message));
        });
    }
  }

  return (
    <View style={styles.container}>
      <TextHandler>Verify</TextHandler>
      {!confirm ? (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TextInput
            style={[styles.textInputStyle]}
            keyboardType="number-pad"
            placeholder="mobile"
            aria-label="mobile"
            maxLength={10}
            placeholderTextColor={'grey'}
            value={mobile}
            onChangeText={e => {
              setMobile(e);
            }}
          />
          <Button title="Send " onPress={() => signInWithPhoneNumber()} />
        </View>
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TextInput
            placeholder="Code"
            keyboardType="number-pad"
            maxLength={6}
            placeholderTextColor={'grey'}
            style={[styles.textInputStyle]}
            value={code}
            onChangeText={text => setCode(text)}
          />
          <Button title="Confirm Code" onPress={() => confirmCode()} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  textInputStyle: {
    padding: 10,
    minHeight: 50,
    marginVertical: 10,
    // borderColor: COLORS.orange,
    borderWidth: 1,
    height: 50,
    borderRadius: 5,
    color: 'black',
    lineHeight: 18,
    minWidth: screenWidth * 0.8,
  },
});
