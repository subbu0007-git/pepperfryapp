import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyD8c1ELlc3Kz9SEIYx5h7n7Vo_QRkUGq44",
  authDomain: "pepperfry-a4a65.firebaseapp.com",
  databaseURL: "https://pepperfry-a4a65-default-rtdb.firebaseio.com/",
  projectId: "pepperfry-a4a65",
  storageBucket: "pepperfry-a4a65.appspot.com",
  messagingSenderId: "518917201034",
  appId: "1:518917201034:web:5e1eb812af1e3191fc6173"
};
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}
export {firebase};