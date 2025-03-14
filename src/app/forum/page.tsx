"use client";

import { userAtom } from "@/atoms/userAtoms";
import ForumDataFetch from "@/component/forumDataFetch";
import { useAtom } from "jotai";
import { useEffect } from "react";

export default function ForumPage() {
  const [user, setUser] = useAtom(userAtom);

  // Sayfa yüklendiğinde, localStorage'dan kullanıcıyı çek
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return <ForumDataFetch />;
}
