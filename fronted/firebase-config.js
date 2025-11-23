import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyCZN41cnsnyJIal1286Y35sU0THPe1EnX8",
    authDomain: "find-flight-auth.firebaseapp.com",
    projectId: "find-flight-auth",
    storageBucket: "find-flight-auth.firebasestorage.app",
    messagingSenderId: "464653263216",
    appId: "1:464653263216:web:91e58dd270934b6000efb5",
    measurementId: "G-P58JV05PSE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth, app, analytics };
