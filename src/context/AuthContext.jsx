
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:5000/api";

const USER_KEY = "shopsphere-user";
const TOKEN_KEY = "shopsphere-token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);

      return savedUser
        ? JSON.parse(savedUser)
        : null;
    } catch (error) {
      console.error(
        "Failed to load saved user:",
        error
      );

      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || "";
  });

  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(
    token && user
  );

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(
        TOKEN_KEY,
        token
      );
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);


  /* =========================================
     REGISTER
  ========================================= */

  const register = async (
    name,
    email,
    password
  ) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Registration failed."
        );
      }

      setUser(data.user);
      setToken(data.token);

      return data.user;

    } catch (error) {
      console.error(
        "Register error:",
        error
      );

      throw error;

    } finally {
      setLoading(false);
    }
  };


  /* =========================================
     LOGIN
  ========================================= */

  const login = async (
    email,
    password
  ) => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Login failed."
        );
      }

      setUser(data.user);
      setToken(data.token);

      // IMPORTANT:
      // Return user so Login.jsx can check role.
      return data.user;

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      throw error;

    } finally {
      setLoading(false);
    }
  };


  /* =========================================
     LOGOUT
  ========================================= */

  const logout = () => {
    setUser(null);
    setToken("");
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
