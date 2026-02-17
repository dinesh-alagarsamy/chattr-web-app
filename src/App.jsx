import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import ChatApp from "./pages/ChatApp";

function AuthRequire({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <AuthRequire>
              <ChatApp />
            </AuthRequire>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
