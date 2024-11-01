"use client";
import { MantineProvider } from "@mantine/core";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Inter } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const firebaseConfig = {
  apiKey: "AIzaSyBrCP4cdAO3iugcXw_3tC-P7Tc6ejaHcn4",
  authDomain: "animepression.firebaseapp.com",
  databaseURL:
    "https://animepression-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "animepression",
  storageBucket: "animepression.appspot.com",
  messagingSenderId: "443513559646",
  appId: "1:443513559646:web:b9876ea8b060b6aa82b2cf",
  measurementId: "G-Z2X190YYL9",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(pathname);
      if ((user && pathname === "/login") || pathname === "/") {
        router.push("/forum");
      } else if (!user && pathname !== "/login") {
        router.push("/login");
      }
    });
  }, [auth, router, pathname]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider withCssVariables withGlobalClasses withStaticClasses>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
