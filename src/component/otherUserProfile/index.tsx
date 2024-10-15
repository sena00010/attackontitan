'use client';
import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

interface OtherUserProfileProps {
  id: string;
}
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

const OtherUserProfile: React.FC<OtherUserProfileProps> = ({ id }) => {
  const [data, setData] = useState<any>(null); // Veri tutmak için state tanımı

  // Kullanıcı verisini Firestore'dan getiren fonksiyon
  const fetchUserInfo = async () => {
    try {
      const userRef = doc(db, 'users', id); // 'users' koleksiyonundan ID'ye göre belgeyi al
      const docSnap = await getDoc(userRef); // Belgeyi getir

      if (docSnap.exists()) {
        setData(docSnap.data()); // Veriyi state'e ata
      } else {
        console.log('Veri bulunamadı');
      }
    } catch (error) {
      console.error('Veri getirme hatası:', error);
    }
  };

  // Sayfa yüklendiğinde veri çekme
  useEffect(() => {
    fetchUserInfo();
  }, [id]);

  // Eğer veri yükleniyorsa "Loading..." göster
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>{data.name}</h2>
      <p>Email: {data.email}</p>
      <p>Yaş: {data.age}</p>
    </div>
  );
};

export default OtherUserProfile;
