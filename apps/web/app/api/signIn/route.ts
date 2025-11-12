import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_URL = `${process.env.API_BASE_URL}/api/auth/login`;

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = await res.json();

        const cookieStore = await cookies();
        cookieStore.set({
            name: 'jwt',
            value: responseData.data.access_token,
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 1 // 1 day
        });

        return NextResponse.json(null, { status: res.status });
    } catch (error) {
        console.error('POST /signIn error:', error);
        return NextResponse.json(
            { error: 'Failed to sign in' },
            { status: 500 }
        );
    }
}
