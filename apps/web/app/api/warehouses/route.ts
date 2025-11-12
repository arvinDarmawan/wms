import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = `${process.env.API_BASE_URL}/api/warehouses`;

//Get all warehouse
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
        const warehouses = await res.json();
        return NextResponse.json(warehouses);
    } catch (error) {
        console.error('GET /warehouses error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch list warehouses' },
            { status: 500 }
        );
    }
}

// POST warehouse
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
        const newWarehouse = await res.json();

        return NextResponse.json(newWarehouse, { status: res.status });
    } catch (error) {
        console.error('POST /warehouses error:', error);
        return NextResponse.json(
            { error: 'Failed to update warehouse' },
            { status: 500 }
        );
    }
}
