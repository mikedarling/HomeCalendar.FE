'use client';

import { ReactNode, useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  // Helper: read and parse the google_tokens cookie (returns parsed tokens or null)
  const readTokenCookie = (): any | null => {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(/(?:^|; )google_tokens=([^;]+)/);
    if (!match) return null;
    try {
      return JSON.parse(decodeURIComponent(match[1]));
    } catch {
      return null;
    }
  };

  // Helper to remove auth cookies (used when tokens are expired/invalid)
  const clearAuthCookies = () => {
    // expire both tokens and user cookies
    document.cookie = `google_tokens=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `google_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  };

  useEffect(() => {
    // Check if logged in
    const handleCheck = () => {
      if (typeof document === "undefined") return false;
      const tokens = readTokenCookie();
      if (!tokens) return false;
      if (typeof tokens.expiry_date === "number") {
        if (tokens.expiry_date > Date.now()) return true;
        clearAuthCookies();
        return false;
      }
      return true;
    };

    setLoggedIn(handleCheck());

    // Update on tab focus (handles login via redirect)
    const onFocus = () => setLoggedIn(handleCheck());
    window.addEventListener("focus", onFocus);

    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn, logout: clearAuthCookies }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;