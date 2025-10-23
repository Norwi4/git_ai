"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import Link from 'next/link';

type Message = {
    role: 'user' | 'assistant';
    content: string;
    type?: 'text' | 'action';
    action?: any;
}

const mockHistory: Message[] = [
    { role: 'user', content: 'Объясни, за что отвечает модуль auth' },
    { 
        role: 'assistant', 
        content: 'Модуль auth отвечает за регистрацию и JWT-токены.',
        type: 'text'
    },
    { role: 'user', content: 'Создай обзорный файл по архитектуре' },
    {
        role: 'assistant',
        content: "Я создала новый файл [overview.md](/docs/gitlab-navigator/overview.md)",
        type: "action",
        action: {
          name: "create_file",
          params: {"path": "doc_ai/overview.md"},
        }
    }
]

export function ChatSidebar() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // In a real app, fetch chat history
    setMessages(mockHistory);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newUserMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    setLoading(true);

    // Simulate API call to POST /api/chat/{sessionId}/message
    setTimeout(() => {
        // Mock response
        const assistantResponse: Message = { role: 'assistant', content: `Это симуляция ответа на: "${input}"` };
        setMessages(prev => [...prev, assistantResponse]);
        setLoading(false);
    }, 1000);
  };
  
  const handleClear = () => {
    // Call DELETE /api/chat/{sessionId}
    setMessages([]);
  };

  return (
    <aside className="border-l bg-background flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold font-headline">Чат</h2>
        <Button variant="ghost" size="icon" onClick={handleClear} aria-label="Очистить чат">
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-xs ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {msg.type === 'action' ? (
                     <Card className="bg-background/50">
                        <CardHeader className="p-3">
                            <CardTitle className="text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Действие выполнено</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                           <p className="text-sm">
                                Создан файл:{' '}
                                <Link href={`/docs/gitlab-navigator/${msg.action.params.path.replace('doc_ai/','')}`} className="underline">
                                    <Badge variant="secondary">{msg.action.params.path.split('/')[1]}</Badge>
                                </Link>
                           </p>
                        </CardContent>
                    </Card>
                ) : <p className="text-sm">{msg.content}</p> }
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
                 <div className="p-3 rounded-lg bg-muted max-w-xs">
                    <p className="text-sm animate-pulse">...</p>
                 </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="relative">
          <Input
            placeholder="Спросите что-нибудь..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
            disabled={loading}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}