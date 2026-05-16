import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import liff from "@line/liff";
import type { Liff } from "@line/liff";
import { getApiClient } from "@/lib/api";

interface BackendProfile {
  lineUserId: string;
  householdId: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
}

interface Household {
  id: string;
  name: string;
  createdAt: string;
}

interface LiffContextType {
  liff: Liff | null;
  isLoggedIn: boolean;
  profile: Awaited<ReturnType<Liff["getProfile"]>> | null;
  backendProfile: BackendProfile | null;
  household: Household | null;
  api: ReturnType<typeof getApiClient> | null;
  error: string | null;
  isLoading: boolean;
}

const LiffContext = createContext<LiffContextType>({
  liff: null,
  isLoggedIn: false,
  profile: null,
  backendProfile: null,
  household: null,
  api: null,
  error: null,
  isLoading: true,
});

export const LiffProvider = ({ children }: { children: ReactNode }) => {
  const [liffState, setLiffState] = useState<Liff | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<Awaited<ReturnType<Liff["getProfile"]>> | null>(null);
  const [backendProfile, setBackendProfile] = useState<BackendProfile | null>(null);
  const [household, setHousehold] = useState<Household | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [apiClient, setApiClient] = useState<ReturnType<typeof getApiClient> | null>(null);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({
          liffId: import.meta.env.VITE_LIFF_ID || "",
        });
        setLiffState(liff);

        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          const userProfile = await liff.getProfile();
          setProfile(userProfile);

          // Get ID Token for backend auth
          const idToken = liff.getIDToken();
          if (idToken) {
            const client = getApiClient(idToken);
            setApiClient(client);

            // Initialize backend profile
            const res = await client.auth.init.$post({
              json: {
                displayName: userProfile.displayName,
                avatarUrl: userProfile.pictureUrl,
              },
            });

            if (res.ok) {
              const data = await res.json();
              setBackendProfile(data.profile as BackendProfile);
              setHousehold(data.household as Household);
            } else {
              console.error("Backend init failed", await res.text());
              setError("Failed to initialize backend session");
            }
          }
        } else {
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
    <LiffContext
      value={{
        liff: liffState,
        isLoggedIn,
        profile,
        backendProfile,
        household,
        api: apiClient,
        error,
        isLoading,
      }}
    >
      {children}
    </LiffContext>
  );
};

export const useLiff = () => useContext(LiffContext);
