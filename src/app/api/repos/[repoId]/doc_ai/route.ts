import { NextResponse } from 'next/server';
import { mockApiDocs } from '@/lib/data';

export async function GET(
  req: Request,
  { params }: { params: { repoId: string } }
) {
  const { repoId } = params;

  const docs = (mockApiDocs as Record<string, any>)[repoId] || [];

  return NextResponse.json(docs);
}
