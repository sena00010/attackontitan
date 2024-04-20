import { Inter } from "next/font/google";
import { initializeApp } from "firebase/app";
import "./globals.css";
import {getFirestore} from "@firebase/firestore";
import {MantineProvider} from "@mantine/core";
const inter = Inter({ subsets: ["latin"] });



// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrCP4cdAO3iugcXw_3tC-P7Tc6ejaHcn4",
  authDomain: "animepression.firebaseapp.com",
  databaseURL: "https://animepression-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "animepression",
  storageBucket: "animepression.appspot.com",
  messagingSenderId: "443513559646",
  appId: "1:443513559646:web:b9876ea8b060b6aa82b2cf",
  measurementId: "G-Z2X190YYL9"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig)
console.log(app,"firebase")
export { app };
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <MantineProvider
    >
      <body className={inter.className}>{children}</body>

    </MantineProvider>
    </html>
  );
}
// async function getCities(db) {
//   const citiesCol = collection(db, 'cities');
//   const citySnapshot = await getDocs(citiesCol);
//   const cityList = citySnapshot.docs.map(doc => doc.data());
//   return cityList;
// }
