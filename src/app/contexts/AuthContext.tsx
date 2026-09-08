import { createContext, useContext, useState, ReactNode } from "react";
import { DemoUser, findDemoUser, UserRole } from "../data/demoUsers";

const AUTH_STORAGE_KEY = "cbd-auth-state-v1";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  currentUser: DemoUser | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadAuthState() {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, currentUser: null as DemoUser | null };
  }

  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return { isAuthenticated: false, currentUser: null as DemoUser | null };

    const parsed = JSON.parse(stored) as {
      isAuthenticated?: boolean;
      userId?: string;
      email?: string;
      name?: string;
      role?: UserRole;
    };

    if (!parsed.isAuthenticated || !["member", "staff"].includes(parsed.role || "")) {
      return { isAuthenticated: false, currentUser: null as DemoUser | null };
    }

    const currentUser = {
      id: parsed.userId || "",
      email: parsed.email || "",
      name: parsed.name || "",
      role: parsed.role,
    };

    const knownUser = findDemoUser(currentUser.email, currentUser.role);

    return {
      isAuthenticated: true,
      currentUser: currentUser.id
        ? {
            ...knownUser,
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.name,
            role: currentUser.role,
          }
        : knownUser,
    };
  } catch {
    return { isAuthenticated: false, currentUser: null as DemoUser | null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState(loadAuthState);
  const { isAuthenticated, currentUser } = authState;
  const userRole = currentUser?.role || null;

  const login = (email: string, password: string, role: UserRole) => {
    // In a real app, you would validate credentials here
    const user = findDemoUser(email, role);
    const nextState = { isAuthenticated: true, currentUser: user };
    setAuthState(nextState);
    window.localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        isAuthenticated: true,
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      })
    );
  };

  const logout = () => {
    setAuthState({ isAuthenticated: false, currentUser: null });
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
