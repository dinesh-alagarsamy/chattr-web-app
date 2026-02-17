import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function MessageBubble({ message }) {
  const { currentUser } = useAuth();
  const isSender = message.senderId === currentUser.uid;

  const formattedTime = message.timestamp?.toDate
    ? format(message.timestamp.toDate(), "HH:mm")
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isSender ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] px-4 py-2.5 shadow-sm ${
          isSender
            ? "text-white rounded-2xl rounded-br-md"
            : "bg-white text-slate-800 rounded-2xl rounded-bl-md border border-slate-100"
        }`}
        style={isSender ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" } : undefined}
      >
        <p className="text-[14px] leading-relaxed">{message.text}</p>
        <div className={`flex items-center gap-1 mt-1 ${isSender ? "justify-end" : "justify-end"}`}>
          <span className={`text-[10px] ${isSender ? "text-white/60" : "text-slate-400"}`}>
            {formattedTime}
          </span>
          {isSender && formattedTime && (
            <Check size={12} className="text-white/60" />
          )}
        </div>
      </div>
    </motion.div>
  );
}
