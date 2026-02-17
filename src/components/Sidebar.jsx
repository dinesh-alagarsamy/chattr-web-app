import Navbar from "./Navbar";
import UserList from "./UserList";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Sidebar({ onSelectChat, activeUserId }) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full bg-white"
    >
      <Navbar />

      {/* Search Bar */}
      <div className="px-4 py-3">
        <motion.div
          className="group flex items-center gap-2.5 bg-slate-100 rounded-xl px-3.5 py-2.5 transition-all duration-300 focus-within:bg-white focus-within:shadow-md focus-within:ring-2 focus-within:ring-indigo-500/30"
        >
          <Search size={16} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm text-slate-700 placeholder-slate-400"
          />
        </motion.div>
      </div>

      {/* Section Label */}
      <div className="px-5 py-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Messages</span>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <UserList onSelectUser={onSelectChat} searchQuery={searchQuery} activeUserId={activeUserId} />
      </div>
    </motion.div>
  );
}
