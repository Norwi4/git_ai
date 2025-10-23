import { NextResponse } from 'next/server';
import { repositories } from '@/lib/data';

export async function GET() {
  const simplifiedRepos = repositories.map(({ id, name, description, lastActivity }) => ({
    id,
    name,
    description,
    lastActivity,
  }));
  return NextResponse.json(simplifiedRepos);
}
