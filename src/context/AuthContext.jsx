import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Create or update user in Firestore
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          const userData = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastSeen: serverTimestamp(),
          };

          if (!userSnap.exists()) {
            await setDoc(userRef, userData);
          } else {
            // merge: true is safer for updates if we add more fields later
            await setDoc(userRef, { lastSeen: serverTimestamp() }, { merge: true });
          }
          
          setCurrentUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback: still set user so they can login, even if DB fails
          setCurrentUser({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
