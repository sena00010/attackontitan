import { Inter } from "next/font/google";
import { initializeApp } from "firebase/app";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });



// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAbxilN0o-2OPUQh8VbCDR8oDeeAMysAg",
  authDomain: "attack-on-titan-fe0b2.firebaseapp.com",
  projectId: "attack-on-titan-fe0b2",
  storageBucket: "attack-on-titan-fe0b2.appspot.com",
  messagingSenderId: "285398761943",
  appId: "1:285398761943:web:c154534c5dbef513154b92"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app };
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
