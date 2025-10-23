"use client";

import { Button } from "@/components/ui/button";
import { Wand2, Activity } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function Header({ repoId }: { repoId: string }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            // In a real app: await fetch(`/api/repos/${repoId}/generate-docs`, { method: 'POST' });
            await new Promise(resolve => setTimeout(resolve, 3000));
            toast({
                title: "Успех!",
                description: "Документация успешно сгенерирована.",
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Ошибка",
                description: "Не удалось сгенерировать документацию.",
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