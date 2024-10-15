import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { app } from "../../app/layout";
import styles from "./MessagesPart.module.css";

// Define a type for user data
type UserData = {
  userName: string;
  userProfilePicture: string;
};

const MessagesPart = ({ roomId }: { roomId: string }) => {
  const db = getFirestore(app);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const [usersMap, setUsersMap] = useState<Map<string, UserData>>(new Map());
  const [roomsData, setRoomsData] = useState<any[]>([]);
  const router = useRouter();
  console.log(roomsData,'roomsData')

  // Fetch all users' data and store in a Map
  const fetchAllUsersData = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "user"));
      const userMap = new Map<string, UserData>();

      usersSnapshot.forEach((doc) => {
        const data = doc.data();
        const userData: UserData = {
          userName: data.userName || "Bilinmiyor",
          userProfilePicture: data.userProfilePictures || "default-profile.png",
        };
        userMap.set(doc.id, userData);
      });

      setUsersMap(userMap);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch rooms and their last message
  const fetchRoomsAndLastMessage = () => {
    const roomsCollection = collection(db, "rooms");

    const unsubscribe = onSnapshot(roomsCollection, async (snapshot) => {
      const roomsWithLastMessage = await Promise.all(
        snapshot.docs.map(async (roomDoc) => {
          const roomId = roomDoc.id;
          const roomData = roomDoc.data();

          // Fetch the last message of the room, ordered by timestamp
          const messagesQuery = query(
            collection(db, "rooms", roomId, "messages"),
            orderBy("timestamp", "desc"),
            limit(1) // Get only the last message
          );
          const messagesSnapshot = await getDocs(messagesQuery);

          const lastMessage = messagesSnapshot.docs[0]
            ? messagesSnapshot.docs[0].data()
            : null;

          return {
            id: roomId,
            ...roomData,
            lastMessageContent:
              lastMessage?.messageContent || "Henüz mesaj yok",
            lastMessageTimestamp: lastMessage?.timestamp?.seconds
              ? new Date(lastMessage.timestamp.seconds * 1000).toLocaleString(
                  "tr-TR"
                )
              : "Zaman yok",
          };
        })
      );

      setRoomsData(roomsWithLastMessage);
    });

    return unsubscribe; // Make sure to unsubscribe later
  };

  useEffect(() => {
    if (!roomId) return;

    // Fetch all user data on mount
    fetchAllUsersData();

    // Listen for new messages in the room, ordered by timestamp
    const messagesQuery = query(
      collection(db, "rooms", roomId, "messages"),
      orderBy("timestamp", "asc") // Sort messages by timestamp in ascending order
    );
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    const unsubscribe = fetchRoomsAndLastMessage();
    return () => unsubscribe();
  }, [db]);

  // Handle sending a new message
  const sendMessage = async () => {
    const currentUserId = getAuth(app).currentUser?.uid;

    if (!messageContent.trim() || !currentUserId) return;

    try {
      await addDoc(collection(db, "rooms", roomId, "messages"), {
        messageContent,
        messageType: "text",
        timestamp: new Date(),
        senderId: currentUserId,
      });
      setMessageContent(""); // Clear the input after sending the message
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div className={styles.appContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3>Chats</h3>
        </div>

        <div className={styles.chatsList}>
          {roomsData.map((room) => (
            <div
              key={room.id}
              className={styles.chatItem}
              onClick={() => router.push(`/rooms/${room.id}`)}
            >
              <img
                src={room.roomImage}
                alt={room.roomName}
                className={styles.chatImage}
              />
              <div className={styles.chatDetails}>
                <span className={styles.chatName}>{room.roomName}</span>
                <span className={styles.chatPreview}>
                  {room.lastMessageContent}
                </span>
              </div>
              <span className={styles.chatTime}>
                {room.lastMessageTimestamp}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className={styles.chatWindow}>
        <div className={styles.chatHeader}>
          {<img src={roomsData[0]?.roomImage} alt="roomImage" className={styles.profileRoomPicture}
 width={100} height={100}/>}
          <h2>{roomsData[0]?.roomName}</h2>
        </div>

        <div className={styles.messagesContainer}>
          {messages.map((message) => {
            const member = usersMap.get(message.senderId) || {
              userName: "Bilinmiyor",
              userProfilePicture: "default-profile.png",
            };

            return (
              <div key={message.id} className={styles.message}>
                <div className={styles.messageHeader}>
                  <img
                    src={member.userProfilePicture}
                    alt="Sender"
                    className={styles.profilePicture}
                  />
                  <span>{member.userName}</span>
                </div>
                <div className={styles.messageContent}>
                  {message.messageContent}
                </div>
                <div className={styles.messageTimestamp}>
                  {new Date(message.timestamp?.seconds * 1000).toLocaleString(
                    "tr-TR"
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input Field */}
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.inputField}
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} className={styles.sendButton}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPart;
