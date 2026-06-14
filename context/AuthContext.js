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
  const [trigger2, settrigger2] = useState(1);
  const [userloader, setuserloader] = useState(false);
  const [loadUsername, setloadUsername] = useState(0);
  const [conversationLoader, setconversationLoader] = useState(false);
  const [loaduserdata, setloaduserdata] = useState(0);
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
  }, [loadUsername, loaduserdata]);
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
  async function DeleteConversation(conId) {
    try {
      const res = await axios.delete(`/api/Conversation?conId=${conId}`);
      return res.data.message;
    } catch (error) {
      return error.response.message;
    }
  }
  async function UpdateConversation(conId, title) {
    try {
      const res = await axios.put("/api/Conversation", {
        conversation_id: conId,
        title: title,
      });
      return res.data.message;
    } catch (error) {
      return error.response.message;
    }
  }
  async function UpdateUsername(UserId, Username) {
    try {
      const res = await axios.put("/api/auth/me", {
        _id: UserId,
        username: Username,
      });
      return res.data.message;
    } catch (error) {
      return error.response.message;
    }
  }
  function reloadData() {
    settrigger((pre) => pre + 1);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        GetConversations,
        reloadData,
        loadUsername,
        setloadUsername,
        DeleteConversation,
        UpdateConversation,
        trigger,
        UpdateUsername,
        settrigger,
        trigger2,
        settrigger2,
        conversation,
        logout,
        userloader,
        conversationLoader,
        loaduserdata,
        setloaduserdata,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function UseAuth() {
  return useContext(AuthContext);
}
