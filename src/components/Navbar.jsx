import { LogOut, MessageCircle } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="p-4 flex justify-between items-center"
         style={{ background: "var(--gradient-primary)" }}>
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <MessageCircle size={18} className="text-white" />
        </div>
        <span className="font-bold text-white text-lg tracking-tight">Chattr</span>
      </div>

      {/* User + Logout */}
      <div className="flex items-center gap-3">
        <img
          src={currentUser?.photoURL || "https://via.placeholder.com/40"}
          alt="Profile"
          className="w-8 h-8 rounded-full ring-2 ring-white/30"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all duration-200 cursor-pointer"
          title="Logout"
        >
          <LogOut size={16} />
        </motion.button>
      </div>
    </div>
  );
}
