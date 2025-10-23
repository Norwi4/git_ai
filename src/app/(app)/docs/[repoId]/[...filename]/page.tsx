"use client";

import { useEffect, useState } from "react";
import { MarkdownViewer } from "@/components/docs/markdown-viewer";
import { FileText } from "lucide-react";

export default function DocFilePage({ params }: { params: { repoId: string, filename: string[] } }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const path = params.filename.join('/');
    const repoId = params.repoId;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        if (path && repoId && apiBaseUrl) {
            setLoading(true);
            setError(null);
            fetch(`${apiBaseUrl}/api/repos/${repoId}/doc_ai/${path}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    setContent(data.content);
                })
                .catch(err => {
                    console.error("Failed to fetch document:", err);
                    setError(`Не удалось загрузить документ: ${path}`);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [path, repoId, apiBaseUrl]);

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

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center text-destructive">
                <div className="text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4" />
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return <MarkdownViewer content={content} />;
}
