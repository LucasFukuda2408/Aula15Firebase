import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import  AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore,collection,addDoc } from "firebase/firestore";

const {getReactNativePersistence} = require("firebase/auth") as any;


const firebaseConfig = {
    apiKey: "AIzaSyA1Mb5XB0c4vlQWxnuyWMGPnpy_G9iBAAc",
    authDomain: "projetofirebase-875d3.firebaseapp.com",
    projectId: "projetofirebase-875d3",
    storageBucket: "projetofirebase-875d3.firebasestorage.app",
    messagingSenderId: "829843594120",
    appId: "1:829843594120:web:a8dde8be7681be291ab83d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Inicializa o atenticador com persistência configurada
export const auth = initializeAuth(app,{
    persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export{app,db,getFirestore,collection,addDoc}