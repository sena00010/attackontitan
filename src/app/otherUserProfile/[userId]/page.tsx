'use client';

import OtherUserProfile from '@/component/otherUserProfile';
import { useParams } from 'next/navigation'; // useRouter yerine useParams kullandık
import React from 'react';

const UserProfile = () => {
  const { userId } = useParams(); // URL parametresini buradan alıyoruz

  if (!userId) return <p>Loading...</p>;

  return <OtherUserProfile id={userId} opened={true} />;
};

export default UserProfile;
