import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = `${process.env.API_BASE_URL}/api/customers`;

//GET customers
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
        const customers = await res.json();
        return NextResponse.json(customers);
    } catch (error) {
        console.error('GET /customers error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch list customers' },
            { status: 500 }
        );
    }
}

// POST customers
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
        const newCustomer = await res.json();

        return NextResponse.json(newCustomer, { status: res.status });
    } catch (error) {
        console.error('POST /customers error:', error);
        return NextResponse.json(
            { error: 'Failed to create customer' },
            { status: 500 }
        );
    }
}
