'use client';

import React, { useEffect, useState } from 'react';
import { app } from "../../app/layout";
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const Rooms = () => {
  const [data, setData] = useState([]);
  const db = getFirestore(app);
  const router=useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomCollection = collection(db, "rooms");
        const roomSnapshot = await getDocs(roomCollection);

        // Veriyi mapleyip obje dizisi olarak ayarlama
        const roomsList = roomSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(roomsList);
        console.log(roomsList, 'Rooms Data');
      } catch (error) {
        console.error("Error fetching rooms: ", error);
      }
    };

    fetchRooms();
  }, [db]);

  return (
    <div>
      <h1>Rooms</h1>
      <ul>
        {data.map(room => (
          <div  key={room.id}
          style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}
          onClick={()=>router.push(`/rooms/${room.id}`)}>
            <h2>{room.roomName}</h2>
            <img src={room.roomImage} alt={room.roomName} style={{ width: '200px' }} />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Rooms;
