import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = `${process.env.API_BASE_URL}/api/warehouses`;

// PATCH warehouse by ID
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt');

        const body = await request.json();
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const warehouse = await res.json();

        return NextResponse.json(warehouse, { status: res.status });
    } catch (error) {
        console.error('PATCH /warehouses error:', error);
        return NextResponse.json(
            { error: 'Failed to update warehouse' },
            { status: 500 }
        );
    }
}

// PATCH warehouse by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('jwt');

        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token?.value}`,
                'Content-Type': 'application/json'
            }
        });
        const warehouse = await res.json();

        return NextResponse.json(warehouse, { status: res.status });
    } catch (error) {
        console.error('DELETE /warehouses error:', error);
        return NextResponse.json(
            { error: 'Failed to delete warehouse' },
            { status: 500 }
        );
    }
}
