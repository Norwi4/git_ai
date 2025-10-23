import { NextResponse } from 'next/server';
import { mockFileContent } from '@/lib/data';

export async function GET(
  req: Request,
  { params }: { params: { repoId: string; filename: string[] } }
) {
    const { filename } = params;
    const path = filename.join('/');

    const content = (mockFileContent as Record<string, any>)[path] || `# Error\n\nFile not found: ${path}`;

    return NextResponse.json({ path, content });
}
