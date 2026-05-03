import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import liff from "@line/liff";
import type { Liff } from "@line/liff";

interface LiffContextType {
  liff: Liff | null;
  isLoggedIn: boolean;
  profile: Awaited<ReturnType<Liff["getProfile"]>> | null;
  error: string | null;
  isLoading: boolean;
}

const LiffContext = createContext<LiffContextType>({
  liff: null,
  isLoggedIn: false,
  profile: null,
  error: null,
  isLoading: true,
});

export const LiffProvider = ({ children }: { children: ReactNode }) => {
  const [liffState, setLiffState] = useState<Liff | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<Awaited<ReturnType<Liff["getProfile"]>> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({
          liffId: import.meta.env.VITE_LIFF_ID || "", // VITE_LIFF_ID must be set in .env
        });
        setLiffState(liff);

        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
        } else {
          // In LIFF browser, it might already be logged in.
          // If not, we might want to trigger login but for now just set state.
          setIsLoggedIn(false);
        }
      } catch (err: any) {
        console.error("LIFF init error", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initLiff();
  }, []);

  return (
    <LiffContext value={{ liff: liffState, isLoggedIn, profile, error, isLoading }}>
      {children}
    </LiffContext>
  );
};

export const useLiff = () => useContext(LiffContext);
