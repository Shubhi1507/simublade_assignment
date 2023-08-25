import {View, Text, StyleSheet, TextInput, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {screenWidth} from '../utils/dimensions.utils';
import {Button} from '../components/Button';
import {ROUTES} from '../navigation/routes.constant';
import {TextHandler} from '../components/TextHandler';
import {REGEX} from '../utils/regex';
import {addToFireStore, db, loginUser} from '../api/firebase.api';
import {useDispatch, useSelector} from 'react-redux';
import ACTION_CONSTANTS from '../redux/action/action';
import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {CONFIGS} from '../utils/config.utils';
import auth from '@react-native-firebase/auth';

export default function LoginScreen({navigation, route}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();

  const store = useSelector(s => s.authReducer);

  useEffect(() => {
    console.log('store', store);
    if (store && store.loggedIn) {
      navigation.reset({
        index: 0,
        routes: [{name: ROUTES.AUTH.DASHBOARDSCREEN}],
      });
    }
  }, []);

  useEffect(() => {
    configureGoogleSign();
  }, []);

  function configureGoogleSign() {
    GoogleSignin.configure({
      webClientId: CONFIGS.WEB_CLIENT_ID,
      offlineAccess: false,
    });
  }

  async function signIn() {
    try {
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
        email: email,
        fullname: firstname + ' ' + lastname,
        bio: '',
        username: uid.substring(0, 8),
        photo: userInfo.user.photo,
        givenName: firstname + ' ' + lastname,
        familyName: lastname,
        name: firstname + ' ' + lastname,
        mobile: '',
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

  async function LoginFieldValidator() {
    if (!email) {
      return Alert.alert('Error', 'Email is required');
    }
    if (REGEX.EMAIL.test(email) == false) {
      return Alert.alert('Error', 'Email is invalid');
    }
    if (!password) {
      return Alert.alert('Error', 'Password is required');
    }

    try {
      const userdata = await loginUser(email, password);
      console.log('user->', userdata.user._user);
      const uid = userdata.user.uid;
      await fetchData(uid, 'email');
    } catch (error) {
      console.log('error', error);
      if (error.constructor == String) {
        return Alert.alert('Error', error.toString());
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
            dispatch({
              type: ACTION_CONSTANTS.LOGIN_SUCCESSFUL,
              payload: {...data, via},
            });
          })
          .catch(error => {
            Alert.alert(JSON.stringify(error.message));
          });
      } else {
        dispatch({
          type: ACTION_CONSTANTS.LOGIN_SUCCESSFUL,
          payload: {...firestoreDocument.data(), via},
        });
      }
      navigation.navigate(ROUTES.AUTH.DASHBOARDSCREEN);
    } catch (error) {
      if (error.constructor == String) {
        return Alert.alert('Error', error.toString());
      }
    }
  }
  return (
    <View style={styles.container}>
      <TextHandler>LOG IN</TextHandler>
      <TextInput
        style={[styles.textInputStyle]}
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
        placeholder="password"
        aria-label="password"
        placeholderTextColor={'grey'}
        value={password}
        onChangeText={e => {
          setPassword(e);
        }}
      />
      <Button
        title={'LOG IN'}
        onPress={() => {
          LoginFieldValidator();
        }}
      />
      <TextHandler style={{marginVertical: 10}}>Or login via</TextHandler>
      <GoogleSigninButton
        style={styles.signInButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => signIn()}
      />

      <Button
        title={'SIGN UP ?'}
        onPress={() => navigation.navigate(ROUTES.AUTH.SIGNUPSCREEN)}
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
  signInButton: {
    width: 192,
    height: 48,
  },
  message: {
    fontSize: 20,
    color: 'red',
  },
});
