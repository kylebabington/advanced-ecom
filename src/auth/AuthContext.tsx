// src/auth/AuthContext.tsx
// Tiny auth state provider using Firebase onAuthStateChanged
// This lets any component know whether a user is logged in.
// Fetches user profile to expose isAdmin for admin-only features.

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { getUserProfile } from '../firebase/users'

type AuthContextValue = {
    user: User | null
    loading: boolean
    isAdmin: boolean
    adminChecked: boolean // true once we've fetched profile (or user is null)
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [adminChecked, setAdminChecked] = useState(false)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u)
            setLoading(false)
        })
        return () => unsub()
    }, [])

    useEffect(() => {
        if (!user) {
            setIsAdmin(false)
            setAdminChecked(true)
            return
        }
        setAdminChecked(false)
        let cancelled = false
        getUserProfile(user.uid).then((profile) => {
            if (!cancelled) {
                setIsAdmin(profile?.isAdmin ?? false)
                setAdminChecked(true)
            }
        })
        return () => { cancelled = true }
    }, [user?.uid])

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            loading,
            isAdmin,
            adminChecked,
            logout: async () => {
                await signOut(auth)
            },
        }),
        [user, loading, isAdmin, adminChecked]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
    return ctx
}