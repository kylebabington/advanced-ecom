// src/auth/AuthContext.tsx
// Tiny auth state provider using Firebase onAuthStateChanged
// This lets any component know whether a user is logged in.

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase/firebase'

type AuthContextValue = {
    user: User | null
    loading: boolean
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // subscribe to auth changes (login/logout/refresh)
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u)
            setLoading(false)
        })
        return () => unsub()
    }, [])

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            loading,
            logout: async () => {
                await signOut(auth)
            },
        }),
        [user, loading]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
    return ctx
}