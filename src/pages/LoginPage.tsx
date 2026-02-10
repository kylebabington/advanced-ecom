// src/pages/LoginPage.tsx
// Email/password login with Firebase Auth.

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage() {
    const nav = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [busy, setBusy] = useState(false)

    return (
        <div className="page" style={{ maxWidth: 520 }}>
            <h2 className="pageTitle">Login</h2>

            {error && <div className="notice">{error}</div>}

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                setError(null)
                setBusy(true)

                try {
                    await signInWithEmailAndPassword(auth, email, password)
                    nav('/')
                } catch (err: unknown) {
                    setError(err instanceof Error ? err.message : 'Login failed')
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
                    {busy ? 'Signing in...' : 'Login'}
                </button>

                <div className="muted small">
                    Need an account? <Link to="/register">Register</Link>
                </div>
            </form>
        </div>
    )
}