import {View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {screenWidth} from '../utils/dimensions.utils';
import {ROUTES} from '../navigation/routes.constant';
import {TextHandler} from '../components/TextHandler';
import {Button} from '../components/Button';
import {SignUpUser, addToFireStore, db} from '../api/firebase.api';
import {REGEX} from '../utils/regex';
import {useDispatch, useSelector} from 'react-redux';
import ACTION_CONSTANTS from '../redux/action/action';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {CONFIGS} from '../utils/config.utils';

export default function SignupScreen({navigation, route}) {
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const store = useSelector(s => s.authReducer);

  async function SignUpFieldValidator() {
    if (!name) {
      return Alert.alert('Error', 'name is required');
    }
    if (!email) {
      return Alert.alert('Error', 'Email is required');
    }
    if (REGEX.EMAIL.test(email) == false) {
      return Alert.alert('Error', 'Email is invalid');
    }
    if (!mobile) {
      return Alert.alert('Error', 'Mobile is required');
    }
    if (mobile.length < 10) {
      return Alert.alert('Error', 'Mobile number must be of 10 digits');
    }
    if (!password) {
      return Alert.alert('Error', 'Password is required');
    }
    if (password.length < 6) {
      return Alert.alert('Error', 'Password must be 6 characters long');
    }
    if (
      password.length !== confirmPassword.length ||
      password !== confirmPassword
    ) {
      return Alert.alert('Error', 'Password mismatch');
    }

    if (!password) {
      return Alert.alert('Error', 'Password is required');
    }

    try {
      const response = await SignUpUser(email, password);
      if (response) {
        console.log(response);

        const uid = response.user.uid;
        const data = {
          uid: uid,
          email: email,
          fullname: name,
          bio: '',
          username: uid.substring(0, 8),
          photo: '',
          givenName: name,
          familyName: name,
          name: name,
          mobile,
          verified: false,
        };
        const usersRef = db;
        let firestoreDocument = await usersRef.doc(uid).get();
        if (!firestoreDocument.exists) {
          usersRef
            .doc(data.uid)
            .set(data)
            .then(() => {
              console.log('added to firestore');
            })
            .catch(error => {
              Alert.alert(JSON.stringify(error.message));
            });
        }

        dispatch({
          type: ACTION_CONSTANTS.LOGIN_SUCCESSFUL,
          payload: {...data, via: 'email'},
        });
        navigation.navigate(ROUTES.AUTH.DASHBOARDSCREEN);
      }
    } catch (error) {
      console.log('error', error);
      if (error.constructor == String) {
        return Alert.alert('Error', error.toString());
      }
    }
  }

  async function signIn() {
    try {
      if (GoogleSignin.isSignedIn()) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {idToken} = userInfo;
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const response = await auth().signInWithCredential(googleCredential);
      const uid = response.user.uid;
      let firstname =
        userInfo.user.givenName !== null && userInfo.user.givenName !== 'null'
          ? userInfo.user.givenName
          : '';
      let lastname =
        userInfo.user.familyName !== null && userInfo.user.familyName !== 'null'
          ? userInfo.user.familyName
          : '';

      const data = {
        uid: uid,
        email: userInfo.user.email,
        fullname: firstname + ' ' + lastname,
        bio: '',
        username: uid.substring(0, 8),
        photo: userInfo.user.photo,
        givenName: userInfo.user.givenName,
        familyName: userInfo.user.familyName,
        name: name,
        mobile: mobile,
        verified: false,
      };
      await fetchData(uid, 'google', data);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // when user cancels sign in process,
        Alert.alert('Process Cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // when in progress already
        Alert.alert('Process in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // when play services not available
        Alert.alert('Play services are not available');
      } else {
        console.log('error', error);
        // some other error
        Alert.alert('Something else went wrong... ', error.toString());
      }
    }
  }

  async function fetchData(uid = '', via = '', data) {
    const usersRef = db;

    try {
      let firestoreDocument = await usersRef.doc(uid).get();
      if (!firestoreDocument.exists) {
        usersRef
          .doc(data.uid)
          .set(data)
          .then(() => {
            console.log('added to firestore');
          })
          .catch(error => {
            Alert.alert(JSON.stringify(error.message));
          });
      }
      dispatch({
        type: ACTION_CONSTANTS.LOGIN_SUCCESSFUL,
        payload: {...data, via},
      });
      navigation.navigate(ROUTES.AUTH.DASHBOARDSCREEN);
    } catch (error) {
      if (error.constructor == String) {
        return Alert.alert('Error', error.toString());
      }
    }
  }

  return (
    <View style={styles.container}>
      <TextHandler>SIGN UP</TextHandler>
      <TextInput
        style={[styles.textInputStyle]}
        placeholder="name"
        aria-label="name"
        placeholderTextColor={'grey'}
        value={name}
        onChangeText={e => {
          setName(e);
        }}
      />

      <TextInput
        style={[styles.textInputStyle]}
        keyboardType="email-address"
        placeholder="email"
        aria-label="email"
        placeholderTextColor={'grey'}
        value={email}
        onChangeText={e => {
          setEmail(e);
        }}
      />
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

      <TextInput
        style={[styles.textInputStyle]}
        placeholder="password"
        aria-label="password"
        placeholderTextColor={'grey'}
        value={password}
        onChangeText={e => {
          setPassword(e);
        }}
      />
      <TextInput
        style={[styles.textInputStyle]}
        placeholder="confirmPassword"
        aria-label="confirmPassword"
        placeholderTextColor={'grey'}
        value={confirmPassword}
        onChangeText={e => {
          setConfirmPassword(e);
        }}
      />
      <Button
        title={'SUBMIT'}
        onPress={() => {
          SignUpFieldValidator();
        }}
      />
      <TextHandler style={{marginVertical: 10}}>Or sign up via</TextHandler>
      <GoogleSigninButton
        style={styles.signInButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => signIn()}
      />

      <Button
        title={'GO BACK TO LOGIN'}
        onPress={() => navigation.navigate(ROUTES.AUTH.LOGINSCREEN)}
        ButtonContainerStyle={{borderBottomWidth: 1, borderBottomColor: 'red'}}
      />
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
