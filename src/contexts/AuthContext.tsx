import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  AuthError
} from "firebase/auth";
import { auth, isFirebaseInitialized } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  connectGoogleCalendar: () => Promise<{ error: AuthError | null; accessToken: string | null }>;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isFirebaseInitialized) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isFirebaseInitialized) return { error: { message: "Firebase not configured" } as AuthError };
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!isFirebaseInitialized) return { error: { message: "Firebase not configured" } as AuthError };
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: fullName
        });
      }
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    if (!isFirebaseInitialized) return;
    try {
      await firebaseSignOut(auth);
      navigate('/auth');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const signInWithGoogle = async () => {
    if (!isFirebaseInitialized) return { error: { message: "Firebase not configured" } as AuthError };
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const connectGoogleCalendar = async () => {
    if (!isFirebaseInitialized) return { error: { message: "Firebase not configured" } as AuthError, accessToken: null };
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken || null;
      return { error: null, accessToken };
    } catch (error: any) {
      return { error, accessToken: null };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle, connectGoogleCalendar, isInitialized: isFirebaseInitialized }}>
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
