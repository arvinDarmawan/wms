import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = `${process.env.API_BASE_URL}/api/users`;

//GET users
export async function GET(request: NextRequest) {
    const url = request.nextUrl;
    const searchParams = url.searchParams;
    const queryString = searchParams.toString();

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt');

        const res = await fetch(`${API_URL}?${queryString}`, {
            headers: {
                Authorization: `Bearer ${token?.value}`
            }
        });
        const users = await res.json();
        return NextResponse.json(users);
    } catch (error) {
        console.error('GET /users error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch list users' },
            { status: 500 }
        );
    }
}

// POST user
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt');

        const body = await request.json();
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const newUser = await res.json();

        return NextResponse.json(newUser, { status: res.status });
    } catch (error) {
        console.error('POST /users error:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}
