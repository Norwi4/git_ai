import { NextResponse } from 'next/server';

// In-memory store for chat histories
const chatHistories: Record<string, any[]> = {};


export async function GET(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;
  const history = chatHistories[sessionId] || [];
  return NextResponse.json({ history });
}

export async function DELETE(
    req: Request,
    { params }: { params: { sessionId: string } }
) {
    const { sessionId } = params;
    if (chatHistories[sessionId]) {
        delete chatHistories[sessionId];
    }
    return NextResponse.json({ message: 'Chat history cleared' });
}
