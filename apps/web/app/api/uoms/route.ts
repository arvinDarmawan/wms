import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = `${process.env.API_BASE_URL}/api/uoms`;

//Get all uom
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
        const uoms = await res.json();
        return NextResponse.json(uoms);
    } catch (error) {
        console.error('GET /uoms error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch list uoms' },
            { status: 500 }
        );
    }
}

// POST uom
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
        const newUom = await res.json();

        return NextResponse.json(newUom, { status: res.status });
    } catch (error) {
        console.error('POST /uoms error:', error);
        return NextResponse.json(
            { error: 'Failed to update uom' },
            { status: 500 }
        );
    }
}
