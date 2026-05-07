"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setuser] = useState({});
  const [conversation, setConversation] = useState([]);
  const [trigger, settrigger] = useState(1);
  const [userloader, setuserloader] = useState(false);
  const [conversationLoader, setconversationLoader] = useState(false);
  useEffect(() => {
    async function GetUserInfo() {
      setuserloader(true);
      try {
        const res = await axios.get("/api/auth/me");
        setuser(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setuser({});
          return;
        }
        console.error("Failed to fetch user:", err);
        setuser({});
      } finally {
        setuserloader(false);
      }
    }

    GetUserInfo();
  }, []);
  async function logout() {
    try {
      await axios.post("/api/auth/logout");
      setuser({});
      router.replace("/login");
    } catch (error) {
      setuser({});
      router.replace("/login");
    }
  }
  async function GetConversations(userId) {
    setconversationLoader(true);
    try {
      const res = await axios.get(`/api/Conversation?userId=${userId}`);

      setConversation(res.data);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
      setConversation([]);
      return [];
    } finally {
      setconversationLoader(false);
    }
  }
  function reloadData() {
    settrigger((pre) => {
      console.log("Trigger updated:", pre + 1);
      return pre + 1;
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        GetConversations,
        reloadData,
        trigger,
        conversation,
        logout,
        userloader,
        conversationLoader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function UseAuth() {
  return useContext(AuthContext);
}
