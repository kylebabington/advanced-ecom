// src/pages/ProfilePage.tsx
// Reads Firestore /users/{uid} and allows update and delete.

import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { deleteUser } from 'firebase/auth'
import { deleteUserProfile, getUserProfile, updateUserProfile } from '../firebase/users'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
    const { user, loading, logout } = useAuth()
    const nav = useNavigate()

    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [busy, setBusy] = useState(false)
    const [msg, setMsg] =useState<string | null>(null)

    useEffect(() => {
        if (!user) return
        ;(async () => {
            const profile = await getUserProfile(user.uid)
            setName(profile?.name ?? '')
            setAddress(profile?.address ?? '')
        })()
    }, [user])

    if (loading) return <div className="page">Loading...</div>
    if (!user) return <div className="page">Please Login to view you profile.</div>

    return (
        <div className="page" style={{ maxWidth: 640 }}>
            <h2 className="pageTitle">Profile</h2>
            <div className="muted small">Signed in as: {user.email}</div>

            {msg && <div className="notice">{msg}</div>}

            <div style={{ display: 'grid', gap: 12, marginTop: 12}}>
                <label className="muted small">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />

                <label className="muted small">Address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} />

                <button
                  className="btn btnPrimary"
                  disabled={busy}
                  onClick={async () => {
                    setBusy(true)
                    setMsg(null)
                    try {
                        await updateUserProfile(user.uid, { name, address })
                        setMsg('Profile updated successfully')
                    } catch (err: unknown) {
                        setMsg(err instanceof Error ? err.message : 'Failed to update profile')
                    } finally {
                        setBusy(false)
                    }
                }}>
                    Save profile
                </button>

                <button
                  className="btn"
                  onClick={async () => {
                    await logout()
                    nav('/')
                  }}
                >
                    Logout
                </button>

                <button
                  className="btn"
                  style={{ borderColor: 'crimson'}}
                  disabled={busy}
                  onClick={async () => {
                    // Delete both Firestore profile and Auth account
                    setBusy(true)
                    setMsg(null)
                    try {
                        await deleteUserProfile(user.uid)
                        await deleteUser(user)
                        nav('/')
                    } catch (err: unknown) {
                        setMsg(err instanceof Error ? err.message : 'Failed to delete account')
                    } finally {
                        setBusy(false)
                    }
                  }}
                >
                    Delete account
                </button>
            </div>
        </div>
    )
}