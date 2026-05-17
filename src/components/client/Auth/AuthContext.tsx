"use client";

import { createClient } from "@/utils/Supabase/client";
import { User } from "@supabase/supabase-js";
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

type AuthContextType = {
    user: User | null;
    getUser: () => User | null;
    setUser: (u: User | null) => void;
    signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_CONTEXT_KEY = "cc_user_context";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    // memoize client so it's stable across renders
    const supabase = useMemo(() => createClient(), []);

    // Load user from localStorage on mount (fallback)
    useEffect(() => {
        const stored = localStorage.getItem(USER_CONTEXT_KEY);
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (err) {
                console.error("Failed to parse user from localStorage", err);
            }
        }
    }, []);

    // Sync user to localStorage on changes
    useEffect(() => {
        if (user) {
            localStorage.setItem(USER_CONTEXT_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(USER_CONTEXT_KEY);
        }
    }, [user]);

    // hydrate user from Supabase and subscribe to auth changes
    useEffect(() => {
        let mounted = true;

        const init = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (!mounted) return;
                if (error) {
                    console.error("getUser error", error);
                } else {
                    setUser(data?.user ?? null);
                }
            } catch (err) {
                console.error("Error initializing auth user", err);
            }
        };

        init();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            mounted = false;
            // unsubscribe listener
            try {
                listener?.subscription?.unsubscribe();
            } catch {
                // noop
            }
        };
    }, [supabase]);

    const getUser = () => user;

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            localStorage.removeItem(USER_CONTEXT_KEY);
        } catch (err) {
            console.error("signOut error", err);
        }
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                getUser,
                setUser,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useUser must be used within UserProvider");
    return context;
};
