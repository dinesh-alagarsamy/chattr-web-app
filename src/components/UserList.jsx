import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Skeleton loader component
function UserSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="w-11 h-11 rounded-full skeleton shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-28 rounded-full skeleton" />
        <div className="h-2.5 w-40 rounded-full skeleton" />
      </div>
    </div>
  );
}

export default function UserList({ onSelectUser, searchQuery = "", activeUserId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const usersRef = collection(db, "users");

    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const usersList = [];
      snapshot.forEach((docSnap) => {
        const userData = docSnap.data();
        if (userData.uid !== currentUser.uid) {
          usersList.push(userData);
        }
      });
      setUsers(usersList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="space-y-1">
        {[1, 2, 3].map((i) => <UserSkeleton key={i} />)}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-1">
        {[1, 2, 3, 4].map((i) => <UserSkeleton key={i} />)}
      </div>
    );
  }

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-y-auto h-full">
      <AnimatePresence>
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.uid}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onSelectUser(user)}
            className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all duration-200 group
              ${activeUserId === user.uid
                ? "bg-indigo-50 border-r-3 border-indigo-500"
                : "hover:bg-slate-50"
              }`}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={user.photoURL || "https://via.placeholder.com/40"}
                alt={user.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all"
              />
              {/* Online dot */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-slate-800 truncate">{user.name}</h3>
              <p className="text-xs text-slate-400 truncate mt-0.5">Click to start chatting</p>
            </div>

            {/* Subtle indicator */}
            <div className="w-2 h-2 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </AnimatePresence>

      {filteredUsers.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
          <p className="text-sm text-slate-400">
            {searchQuery ? "No users match your search" : "No other users found"}
          </p>
        </motion.div>
      )}
    </div>
  );
}
