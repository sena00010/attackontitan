'use client';

import MessagesPart from '@/component/MessagesPart';
import { useParams } from 'next/navigation'; // useRouter yerine useParams kullandık
import React from 'react';

const Message = () => {
  const { roomId } = useParams(); // URL parametresini buradan alıyoruz

  if (!roomId) return <p>Loading...</p>;

  return <MessagesPart roomId={roomId} />;
};

export default Message;
