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

export function ChatSidebar() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);


  useEffect(() => {
    // A session ID can be tied to a repo, a user, etc.
    // For this example, we'll use a repoId from the URL, but this is not secure.
    const repoId = window.location.pathname.split('/')[2] || 'default';
    const storedSessionId = localStorage.getItem(`chatSession_${repoId}`);
    const newSessionId = storedSessionId || `${repoId}-${Date.now()}`;
    if (!storedSessionId) {
      localStorage.setItem(`chatSession_${repoId}`, newSessionId);
    }
    setSessionId(newSessionId);
  }, []);

  useEffect(() => {
    if (sessionId) {
      fetchHistory(sessionId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);


  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const fetchHistory = async (id: string) => {
    try {
        setLoading(true);
        const response = await fetch(`/api/chat/${id}`);
        if(response.ok) {
            const data = await response.json();
            setMessages(data.history);
        } else {
            setMessages([]);
        }
    } catch (error) {
        console.error("Failed to fetch chat history", error);
        setMessages([]);
    } finally {
        setLoading(false);
    }
  }

  const handleSend = async () => {
    if (!input.trim() || !sessionId) return;
    const newUserMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newUserMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`/api/chat/${sessionId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: currentInput })
      });
      const assistantResponse = await response.json();
      setMessages(prev => [...prev, assistantResponse]);
    } catch(error) {
        console.error("Failed to send message", error);
        const errorResponse: Message = { role: 'assistant', content: 'Извините, произошла ошибка.' };
        setMessages(prev => [...prev, errorResponse]);
    } finally {
        setLoading(false);
    }
  };
  
  const handleClear = async () => {
    if (!sessionId) return;
    try {
        await fetch(`/api/chat/${sessionId}`, { method: 'DELETE' });
        setMessages([]);
    } catch (error) {
        console.error("Failed to clear chat", error);
    }
  };

  return (
    <aside className="border-l bg-background flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold font-headline">Чат</h2>
        <Button variant="ghost" size="icon" onClick={handleClear} aria-label="Очистить чат" disabled={!sessionId || messages.length === 0}>
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
                           <span className="text-sm">
                                Создан файл:{' '}
                                <Link href={`/docs/gitlab-navigator/${msg.action.params.path.replace('doc_ai/','')}`} className="underline">
                                    <Badge variant="secondary">{msg.action.params.path.split('/')[1]}</Badge>
                                </Link>
                           </span>
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
            disabled={loading || !sessionId}
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={handleSend}
            disabled={!input.trim() || loading || !sessionId}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
