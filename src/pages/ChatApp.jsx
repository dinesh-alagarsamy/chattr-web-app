import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatApp() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="h-screen w-screen flex items-center justify-center p-0 md:p-6"
         style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e293b 100%)" }}>

      {/* Main container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full h-full md:max-w-6xl md:max-h-[90vh] md:rounded-2xl overflow-hidden flex shadow-2xl"
        style={{ boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)" }}
      >
        {/* Sidebar */}
        <div className={`w-full md:w-[340px] lg:w-[380px] h-full bg-white flex-shrink-0 border-r border-slate-200/60 ${
          selectedUser ? "hidden md:flex md:flex-col" : "flex flex-col"
        }`}>
          <Sidebar onSelectChat={setSelectedUser} activeUserId={selectedUser?.uid} />
        </div>

        {/* Main Chat Area */}
        <div className={`flex-1 h-full flex flex-col bg-slate-50 ${
          !selectedUser ? "hidden md:flex" : "flex"
        }`}>
          <AnimatePresence mode="wait">
            {selectedUser ? (
              <ChatWindow
                key={selectedUser.uid}
                chatUser={selectedUser}
                onBack={() => setSelectedUser(null)}
              />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-8"
                style={{ background: "var(--gradient-chat-bg)" }}
              >
                {/* Decorative rings */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 w-28 h-28 rounded-full pulse-ring"
                       style={{ background: "var(--gradient-primary)", opacity: 0.1 }} />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="relative w-28 h-28 rounded-full flex items-center justify-center"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <MessageCircle size={48} className="text-white" />
                  </motion.div>
                </div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-slate-700 mb-2"
                >
                  Welcome to <span className="gradient-text">Chattr</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-400 text-sm max-w-xs"
                >
                  Select a conversation from the sidebar to start chatting in realtime
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
