// This file is no longer used and can be removed.
// The frontend now calls the backend API directly at http://localhost:8081.
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    return NextResponse.json({ error: 'This endpoint is deprecated.' }, { status: 404 });
}

export async function DELETE(req: Request) {
    return NextResponse.json({ error: 'This endpoint is deprecated.' }, { status: 404 });
}
