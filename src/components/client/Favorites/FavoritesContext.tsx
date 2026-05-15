"use client"
import React, { useEffect } from "react";
import { useUser } from "../Auth/AuthContext";
import getUserFavorites from "@/utils/server/getUserFavorites";
import { FavoritesResponse } from "@/types/Favorites";

type FavoritesContextType = {
    favorites: FavoritesResponse[];
    setFavorites: React.Dispatch<React.SetStateAction<FavoritesResponse[]>>;
    productIds: string[];
    toggleFavoriteById: (productId: string) => void
}
const FavoritesContext = React.createContext<FavoritesContextType | undefined>(undefined)
const FAVORITES_KEY = "cc_bar_favorites";


export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
    const [favorites, setFavorites] = React.useState<FavoritesResponse[]>([])
    const [productIds, setProductIds] = React.useState<string[]>([])
    const { user } = useUser()

    // ✅ Load favorites from localStorage on mount (fallback) — normalize formats
    useEffect(() => {
        const stored = typeof window !== "undefined" ? localStorage.getItem(FAVORITES_KEY) : null;
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    // array of objects with product_id?
                    if (parsed.length > 0 && typeof parsed[0] === "object" && parsed[0] !== null && "product_id" in parsed[0]) {
                        setFavorites(parsed as FavoritesResponse[]);
                        setProductIds(parsed.map((fav: any) => String(fav.product_id)));
                    } else {
                        // assume array of ids (string | number)
                        setProductIds(parsed.map((id: any) => String(id)));
                        setFavorites([]); // no full favorite objects available
                    }
                }
            } catch (err) {
                console.error("Failed to parse favorites from localStorage", err);
            }
        }
    }, []);

       // ✅ Persist only productIds to localStorage
       useEffect(() => {
        try {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(productIds));
        } catch (err) {
            console.error("Failed to persist favorites to localStorage", err);
        }
    }, [productIds]);

     // Fetch user favorites from DB when user changes
  useEffect(() => {
    const getFavorites = async () => {
      if (!user?.id) return;
      try {
        const favorites = await getUserFavorites(user.id);
        const productIds = favorites.map((fav: { product_id: string }) => fav.product_id);
        setFavorites(favorites);
        setProductIds(productIds);
      } catch (error) {
        console.error("Error fetching user favorites:", error);
      }
    };

    getFavorites();
  }, [user?.id]);

  const toggleFavoriteById = (productId: string) => {
    const idStr = String(productId);
    setProductIds((prev) => {
        if (!prev.includes(idStr)) {
            return [...prev, idStr];
        } else {
            return prev.filter((id) => id !== idStr);
        }
    });

    // keep favorites array in sync (best-effort)
    setFavorites((prev) => {
        if (prev.find((f) => String(f.product_id) === idStr)) {
            return prev.filter((f) => String(f.product_id) !== idStr);
        } else {
            // minimal placeholder entry (replace if you fetch full favorites later)
            return [...prev, { product_id: idStr } as unknown as FavoritesResponse];
        }
    });
}



   
     return (
            <FavoritesContext.Provider value={{ favorites, setFavorites, productIds, toggleFavoriteById}}>
                {children}
            </FavoritesContext.Provider>
        )
    }

export const useFavorites = () => {
    const context = React.useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
}