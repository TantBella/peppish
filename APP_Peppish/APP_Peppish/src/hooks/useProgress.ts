import { useEffect, useState } from "react";

export interface Progress {
  currentLevel: number;
  currentXp: number;
  xpToNextLevel: number;
  dailyProgressPercent: number;
}

export const useProgress = () => {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Ingen inloggad användare.");
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/progress`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Kunde inte hämta progress.");
        }

        const data: Progress = await response.json();

        setProgress(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ett fel uppstod.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return {
    progress,
    loading,
    error,
  };
};
