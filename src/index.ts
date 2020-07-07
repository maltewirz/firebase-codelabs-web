// Import stylesheets
import './style.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from 'firebaseui';
// console.log('hi', firebase);

// Document elements
document.addEventListener('DOMContentLoaded', (event) => {
  const startRsvpButton = document.getElementById('startRsvp');
  const guestbookContainer = document.getElementById('guestbook-container');
  
  const form = document.getElementById('leave-message');
  const input = (document.getElementById('message') as HTMLInputElement);
  const guestbook = document.getElementById('guestbook');
  const numberAttending = document.getElementById('number-attending');
  const rsvpYes = document.getElementById('rsvp-yes');
  const rsvpNo = document.getElementById('rsvp-no');
  
  var rsvpListener = null;
  var guestbookListener = null;
  // Add Firebase project configuration object here
  var firebaseConfig = {
    apiKey: "AIzaSyCMse2a4FaksyS80HXuZ5Sd9H_ySGijpgc",
    authDomain: "fir-codelab-web1.firebaseapp.com",
    databaseURL: "https://fir-codelab-web1.firebaseio.com",
    projectId: "fir-codelab-web1",
    storageBucket: "fir-codelab-web1.appspot.com",
    messagingSenderId: "1057671790800",
    appId: "1:1057671790800:web:d9cba9eca0f97159415ed5"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // FirebaseUI config
  const uiConfig = {
    credentialHelper: firebaseui.auth.CredentialHelper.NONE,
    signInOptions: [
      // Email / Password Provider.
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: function(authResult:any , redirectUrl: any){
        // Handle sign-in.
        // Return false to avoid redirect.
        return false;
      }
    }
  };
  
  const ui = new firebaseui.auth.AuthUI(firebase.auth());
  
  startRsvpButton.addEventListener('click', 
    () => {
      if (firebase.auth().currentUser) {
        firebase.auth().signOut();
      } else {
        ui.start('#firebaseui-auth-container', uiConfig);
      }
  });

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      startRsvpButton.textContent = "LOGOUT"
      // Show guestbook to logged-in users
      guestbookContainer.style.display = "block";
    } else {
      startRsvpButton.textContent = "RSVP"
      // Hide guestbook for non-logged-in users
      guestbookContainer.style.display = "none";
    }
  });

  // Listen to the form submission
  form.addEventListener("submit", (e) => {
    // Prevent the default form redirect
    e.preventDefault();
    // Write a new message to the database collection "guestbook"
    firebase.firestore().collection("guestbook").add({
      text: input.value,
      timestamp: Date.now(),
      name: firebase.auth().currentUser.displayName,
      userId: firebase.auth().currentUser.uid
    })
    // clear message input field
    input.value = ""; 
    // Return false to avoid redirect
    return false;
  });

});



