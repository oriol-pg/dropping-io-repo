import { useEffect, useState } from "react";
import { getAuthClient } from "../lib/auth";
import Dashboard from "./Dashboard";
import Login from "./Login";

export default function WelcomeApp() {
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check auth state with better-auth
  useEffect(() => {
    let isMounted = true;
    async function fetchUser() {
      setLoading(true);
      try {
        const auth = getAuthClient();
        const session = await auth.getSession();
        if (session?.data?.user) {
          if (isMounted) {
            setUser({
              email: session.data.user.email,
              name: session.data.user.name || session.data.user.email.split("@")[0],
            });
          }
        } else {
          if (isMounted) setUser(null);
        }
      } catch (err) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchUser();
    // Optionally, listen for session changes (e.g. via events or polling)
    return () => {
      isMounted = false;
    };
  }, []);

  // Optionally, you could add a polling or event-based update for session here

  const handleLogin = async (email: string) => {
    setLoading(true);
    try {
      const auth = getAuthClient();
      await auth.signIn.magicLink({
        email,
        callbackURL: `${window.location.protocol}//${window.location.host}`,
      });
      // After sending magic link, user is not yet authenticated, so don't set user here.
      // Optionally, show a message to check email.
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const auth = getAuthClient();
      await auth.signOut();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // After magic link, user will be redirected back and session will be checked on mount

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  } else {
    return <Login onLogin={handleLogin} isLoading={loading} />;
  }
}
