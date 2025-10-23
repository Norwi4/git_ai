import { NextResponse } from 'next/server';

// In-memory store for chat histories
const chatHistories: Record<string, any[]> = {};

export async function POST(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;
  const { content } = await req.json();

  if (!chatHistories[sessionId]) {
    chatHistories[sessionId] = [];
  }

  chatHistories[sessionId].push({ role: 'user', content });

  // Mock LLM response
  const assistantResponse = {
    role: 'assistant',
    content: `Это мок-ответ на ваше сообщение: "${content}"`,
    type: 'text',
  };

  // Simulate a file creation action sometimes
  if (content.toLowerCase().includes('создай файл')) {
    const fileName = `new-file-${Date.now()}.md`;
    assistantResponse.content = `Я создала новый файл [${fileName}](/docs/gitlab-navigator/${fileName})`;
    assistantResponse.type = 'action';
    (assistantResponse as any).action = {
      name: 'create_file',
      params: { path: `doc_ai/${fileName}` },
      result: { status: 'success' },
    };
  }
  
  chatHistories[sessionId].push(assistantResponse);

  return NextResponse.json(assistantResponse);
}
