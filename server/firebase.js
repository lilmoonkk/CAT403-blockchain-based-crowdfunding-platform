const { initializeApp } = require( "firebase/app");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } = require( "firebase/auth");

const firebaseConfig = {
    apiKey: "AIzaSyAwQmgxIr4QI9K00kLS75eVwzvDNOqKgso",
    authDomain: "letsfund-5c3de.firebaseapp.com",
    projectId: "letsfund-5c3de",
    storageBucket: "letsfund-5c3de.appspot.com",
    messagingSenderId: "546177267549",
    appId: "1:546177267549:web:2830c8ba45d1da84215ab4",
    measurementId: "G-CMJD8LDG3G"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

/* Auth */
const createUser = (email, password, callback) => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(userCredentials => {
        //console.log(userCredentials.user.uid);
        //const user = userCredentials.user;
        //window.alert('Successfully Registered with' + ('\n') + email);
        callback(userCredentials.user.uid);
    }).catch(error => console.log(error.message))
}

const signInUser = (email, password, callback) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(userCredentials => {
        //console.log(userCredentials);
        //const user = userCredentials.user;
        //window.alert('Successfully Registered with' + ('\n') + email);
        callback(userCredentials.user.uid);
    }).catch(error => callback())
}

const signOutUser = () => {
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
    // An error happened.
    });
}


const isLoggedIn = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          return user.uid;
          // ...
        } else {
          // User is signed out
          // ...
          return false;
        }
    })
}

module.exports = {
    app,
    createUser,
    signInUser,
    signOutUser,
    isLoggedIn
};