'use client';

export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    createdAt: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
}

import { generateContentHash } from './crypto';

const USERS_KEY = 'securedoc_users';
const SESSION_KEY = 'securedoc_session';

async function hashPassword(password: string): Promise<string> {
    return generateContentHash(password);
}

function getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(USERS_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function signUp(name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const users = getUsers();

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'An account with this email already exists.' };
    }

    const passwordHash = await hashPassword(password);
    const newUser: User = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
        name,
        email: email.toLowerCase(),
        passwordHash,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Auto-login after sign up
    const session: AuthUser = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return { success: true };
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const users = getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return { success: false, error: 'No account found with this email.' };
    }

    const passwordHash = await hashPassword(password);
    if (user.passwordHash !== passwordHash) {
        return { success: false, error: 'Incorrect password.' };
    }

    const session: AuthUser = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    return { success: true };
}

export function logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    try {
        const data = localStorage.getItem(SESSION_KEY);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
}
