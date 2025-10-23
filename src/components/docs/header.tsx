"use client";

import { Button } from "@/components/ui/button";
import { Wand2, Activity } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function Header({ repoId }: { repoId: string }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleGenerate = async () => {
        if (!apiBaseUrl) {
            toast({
                variant: "destructive",
                title: "Ошибка",
                description: "Не настроен базовый URL API.",
            });
            return;
        }
        setIsGenerating(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/repos/${repoId}/generate-docs`, { method: 'POST' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            toast({
                title: "Успех!",
                description: "Генерация документации запущена.",
            });
        } catch (error) {
            console.error("Failed to generate docs", error);
            toast({
                variant: "destructive",
                title: "Ошибка",
                description: "Не удалось запустить генерацию документации.",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <header>
            <div className="flex items-center justify-between p-4 h-16 border-b">
                <h1 className="text-xl font-headline font-semibold">{repoId}</h1>
                <Button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? (
                        <Activity className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Сгенерировать документацию
                </Button>
            </div>
        </header>
    );
}
