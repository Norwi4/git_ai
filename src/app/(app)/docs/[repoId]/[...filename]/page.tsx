"use client";

import { useEffect, useState } from "react";
import { MarkdownViewer } from "@/components/docs/markdown-viewer";
import { FileText } from "lucide-react";

export default function DocFilePage({ params }: { params: { repoId: string, filename: string[] } }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const path = params.filename.join('/');

    useEffect(() => {
        if (path) {
            setLoading(true);
            // In a real app, this would be an API call.
            // For now, we simulate a delay and mock the content.
            setTimeout(() => {
                setContent(`## ${path}\n\nЭто содержимое для файла ${path}, загруженное асинхронно. В реальном приложении здесь будет отображаться содержимое файла Markdown, полученное из API.`);
                setLoading(false);
            }, 500);
        }
    }, [path]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 animate-pulse" />
                    <p>Загрузка документа...</p>
                </div>
            </div>
        )
    }

    return <MarkdownViewer content={content} />;
}