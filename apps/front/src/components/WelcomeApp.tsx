import { useEffect, useState } from "react";
import { getAuthClient } from "../lib/auth";
import Dashboard from "./Dashboard";
import Login from "./Login";

export default function WelcomeApp() {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });

  useEffect(() => {
    // Sync user state with localStorage changes (e.g., in other tabs)
    function syncUser() {
      const saved = localStorage.getItem("user");
      setUser(saved ? JSON.parse(saved) : null);
    }
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogin = async (email: string) => {
    const userObj = { email, name: email.split("@")[0] };
    await getAuthClient().signIn.magicLink({ email, callbackURL: `${window.location.protocol}://${window.location.host}` });
    setUser(userObj);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  } else {
    return <Login onLogin={handleLogin} isLoading={false} />;
  }
}
