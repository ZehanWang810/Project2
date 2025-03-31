// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNzICXO4MVqYc-nXr70_2NarElaQGh0vw",
  authDomain: "project2-50c2c.firebaseapp.com",
  projectId: "project2-50c2c",
  storageBucket: "project2-50c2c.firebasestorage.app",
  messagingSenderId: "1093367048965",
  appId: "1:1093367048965:web:dfbcd6dda9d12c555f256c",
  measurementId: "G-QQ679PXHY9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);      // 身份认证服务
export const db = getFirestore(app);   // 数据库服务

// 可选：其他服务初始化
// export const storage = getStorage(app);  // 存储服务
// export const analytics = getAnalytics(app); // 分析服务