import { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import MessageBubble from "./MessageBubble";
import { Send, ArrowLeft, Smile } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWindow({ chatUser, onBack }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const chatId = [currentUser.uid, chatUser.uid].sort().join("_");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const messagesCollectionRef = collection(db, "messages", chatId, "chatMessages");
    const q = query(messagesCollectionRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [chatUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage;
    setNewMessage("");
    setSending(true);

    try {
      const messagesCollectionRef = collection(db, "messages", chatId, "chatMessages");

      await addDoc(messagesCollectionRef, {
        senderId: currentUser.uid,
        text: messageText,
        timestamp: serverTimestamp(),
      });

      const chatDocRef = doc(db, "chats", chatId);
      await setDoc(
        chatDocRef,
        {
          chatId,
          lastMessage: messageText,
          lastMessageTimestamp: serverTimestamp(),
          users: [currentUser.uid, chatUser.uid],
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full relative"
      style={{ background: "var(--gradient-chat-bg)" }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

      {/* Header */}
      <div className="relative z-10 px-4 py-3 flex items-center gap-3 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        {/* Back button for mobile */}
        {onBack && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
          </motion.button>
        )}

        <div className="relative">
          <img
            src={chatUser.photoURL || "https://via.placeholder.com/40"}
            alt={chatUser.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-slate-800 text-sm truncate">{chatUser.name}</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-600 font-medium">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <span className="text-3xl">💬</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">No messages yet</p>
            <p className="text-slate-400 text-xs mt-1">Say hello to {chatUser.name}!</p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 px-4 py-3 bg-white/80 backdrop-blur-md border-t border-slate-200/50">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer"
          >
            <Smile size={20} />
          </motion.button>

          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 outline-none transition-all duration-300 focus:bg-white focus:shadow-md focus:ring-2 focus:ring-indigo-500/30"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            disabled={!newMessage.trim() || sending}
            className={`p-2.5 rounded-xl text-white transition-all duration-300 cursor-pointer ${
              newMessage.trim()
                ? "opacity-100"
                : "opacity-40"
            }`}
            style={{ background: "var(--gradient-primary)" }}
          >
            <Send size={18} className={`transition-transform duration-200 ${newMessage.trim() ? "-rotate-45" : ""}`} />
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
