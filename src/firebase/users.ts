// src/firebase/users.ts
// Firestore CRUD operations for users
// Auth users live in Firebase Auth; profile data lives in Firestore /users/{uid}

import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from './firebase'

export type UserProfile = {
    uid: string
    email: string
    name?: string
    address?: string
    createdAt: number
}

export async function createUserProfile(profile: UserProfile): Promise<void> {
    // Use uid as doc id for easy lookup
    const ref = doc(db, 'users', profile.uid)
    await setDoc(ref, profile)
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return snap.data() as UserProfile
}

export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    const ref = doc(db, 'users', uid)
    await updateDoc(ref, updates)
}

export async function deleteUserProfile(uid: string): Promise<void> {
    const ref = doc(db, 'users', uid)
    await deleteDoc(ref)
}

