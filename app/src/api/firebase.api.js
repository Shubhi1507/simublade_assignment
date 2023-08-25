import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {utils} from '@react-native-firebase/app';

export const authFB = auth;
export const firestoreDB = firestore;
export const db = firestore().collection('users');

// CREATE USER
export const createUser = async (email = '', password = '') => {
  console.log('entered', email, password);
  try {
    const result = await authFB().createUserWithEmailAndPassword(
      email.trim(),
      password,
    );
    return result;
  } catch (error) {
    console.log('err', error.code);
    if (error.code === 'auth/email-already-in-use') {
      throw 'Email already registered';
    }
    if (error.code === 'auth/invalid-email') {
      throw 'Email is invalid';
    }
    if (error.code === 'auth/operation-not-allowed') {
      throw 'Operation not allowed';
    }
    if (error.code === 'auth/weak-password') {
      throw 'Weak Password';
    }
  }
};

// LOGIN
export const loginUser = async (email = '', password = '') => {
  console.log('input', email, password);
  try {
    const result = await authFB().signInWithEmailAndPassword(email, password);
    console.log('result', result);
    return result;
  } catch (error) {
    console.log('loginUser', error);
    if (error.code === 'auth/invalid-email') {
      throw 'Email is invalid';
    }
    if (error.code === 'auth/user-disabled') {
      throw 'User disabled';
    }
    if (error.code === 'auth/user-not-found') {
      throw 'User not found';
    }
    if (error.code === 'auth/wrong-password') {
      throw 'Wrong password';
    }
    if (error.code === 'auth/too-many-requests') {
      throw 'Too many requests. Please try again in sometime';
    }
  }
};

export async function SignUpUser(email = '', password = '') {
  try {
    const result = await authFB().createUserWithEmailAndPassword(
      email,
      password,
    );
    return result;
  } catch (error) {
    console.log('sign up error', error);
    if (error.code === 'auth/email-already-in-use') {
      throw 'Email already registered';
    }
  }
}

export async function addToFireStore(body) {
  try {
    const result = await db.add(body);
    return result;
  } catch (error) {}
}

const addorUpdatetoCloudStore = async (number: string, surveydata: []) => {
  try {
    let results = await (await db.where('number', '==', number).get()).docs;
    if (results.length > 0) {
      if (
        surveydata &&
        surveydata.length > 0 &&
        Array.isArray(JSON.parse(surveydata))
      ) {
        await db.doc(results[0].id).update({number, survey: surveydata});
      } else {
        console.log('fetching....');
        return results[0].data();
      }
    }
    if (results.length === 0) {
      console.log('adding...');
      await db.add({number, survey: surveydata});
    }
  } catch (error) {
    console.log(error);
  }
};

// VERIFY PHONE
export const PhoneVerification = async (phone = '') => {
  console.log('phone --> ', phone);
  try {
    const confirmation = await authFB().verifyPhoneNumber(phone.trim());
    console.log('confirmation', confirmation);
    return confirmation;
  } catch (error) {
    if (error.code === 'auth/too-many-requests') {
      throw 'TOO_MANY_LOGIN_REQUESTS';
    }
    if (error.code === 'auth/invalid-phone-number') {
      throw 'INVALID_PHONE_NUMBER';
    }
  }
};

//  GET PROFILE DATA VIA UID
// export const getProfilDatafromUID = async (uid = '') => {
//   try {
//     const data = await firestoreDB().collection('users').doc(uid).get();
//     return data;
//   } catch (err) {
//     console.log('login err', err);
//     throw err;
//   }
// };

// RESET PASSWORD
export const resetPasswordviaEmail = async (email = '') => {
  try {
    const data = await authFB().sendPasswordResetEmail(email);
    return data;
  } catch (err) {
    if (err.code == 'auth/invalid-email') {
      throw 'EMAIL_IS_INVALID';
    }
    if (err.code == 'auth/user-not-found') {
      throw 'USER_NOT_FOUND';
    }
  }
};

// REAUTHENICATE
export async function reauthenticateUser(email = '', currentPassword = '') {
  let user = authFB().currentUser;
  let cred = authFB.EmailAuthProvider.credential(email, currentPassword);
  try {
    const data = user.reauthenticateWithCredential(cred);
    return data
      .then(s => {
        console.log(s);
      })
      .catch(error => {
        console.log('wqq', error);
        if (error.code === 'auth/user-disabled') {
          throw 'USER_NOT_FOUND';
        }
        if (error.code === 'auth/user-not-found') {
          throw 'USER_NOT_FOUND';
        }
        if (error.code === 'auth/wrong-password') {
          throw 'PASSWORD_WRONG';
        }
        if (error.code === 'auth/too-many-requests') {
          throw 'TOO_MANY_LOGIN_REQUESTS';
        }
      });
  } catch (error) {
    console.error('2nd', error.code);
  }
}
