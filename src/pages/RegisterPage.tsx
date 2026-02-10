// src/pages/RegisterPage.tsx
// Email/password registration with Firebase Auth.
// After creating auth user, we create /users/{uid} profile doc in Firestore.

import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { createUserProfile } from '../firebase/users'
import { useNavigate, Link } from 'react-router-dom'

export default function RegisterPage() {
    const nav = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)

    return (
        <div className="page" style={{ maxWidth: 520 }}>
            <h2 className="pageTitle">Create Account</h2>

            {error && <div className="notice">{error}</div>}

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setError(null)
                setBusy(true)

                try {
                    // 1. Create Auth user
                    const cred = await createUserWithEmailAndPassword(auth, email, password)

                    // 2. Create Firestore profile doc
                    await createUserProfile({
                        uid: cred.user.uid,
                        email: cred.user.email ?? email,
                        createdAt: Date.now(),
                    })

                    nav('/')
                } catch (err: unknown) {
                    setError(err instanceof Error ? err.message : 'Registration failed')
                } finally {
                    setBusy(false)
                }
              }}
              style={{ display: 'grid', gap: 12}}
              >
                <label className="muted small">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />

                <label className="muted small">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button className="btn btnPrimary" disabled={busy}>
                 {busy ? 'Creating...' : 'Register'}   
                </button>

                <div className="muted small">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
              </form>
        </div>
    )
}