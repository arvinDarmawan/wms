'use server';

import { cookies } from 'next/headers';

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;

    const res = await fetch(`${process.env.API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        const message = await res.text();
        throw new Error(`API Error (${res.status}): ${message}`);
    }

    return res.json();
}
