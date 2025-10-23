"use client";

import { useState } from "react";
import { suggestCodeAssistance } from "@/ai/flows/suggest-code-assistance";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Activity, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sampleCode = `function MyComponent() {
  // How can I fetch data here and handle loading states in a Next.js App Router component?
  return <div>My Component</div>
}`;

export function CodeAssistant() {
  const [code, setCode] = useState(sampleCode);
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggest = async () => {
    setIsLoading(true);
    setSuggestion("");
    try {
      const result = await suggestCodeAssistance({
        codeSnippet: code,
        projectDetails: "This is a Next.js project using React Server Components by default, with TypeScript and Tailwind CSS. Use functional components and hooks.",
        relevantFiles: "page.tsx, layout.tsx, data.ts"
      });
      setSuggestion(result.suggestions);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Suggestion failed",
        description: "Could not get AI suggestion. Please try again.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Code</CardTitle>
          <CardDescription>Paste your code snippet below and get assistance.</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="min-h-[300px] font-code text-sm bg-background"
            placeholder="Enter your code here..."
          />
          <Button onClick={handleSuggest} disabled={isLoading || !code} className="mt-4 w-full">
            {isLoading ? (
              <Activity className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            Get Assistance
          </Button>
        </CardContent>
      </Card>
      <Card className="bg-secondary/50">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5" />
            AI Suggestion
          </CardTitle>
          <CardDescription>The AI will provide suggestions to improve your code.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <Activity className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="bg-background rounded-md p-4 min-h-[300px] text-sm">
                {suggestion ? <pre className="whitespace-pre-wrap bg-transparent p-0 m-0 font-code">{suggestion}</pre> : <p className="text-muted-foreground">AI suggestions will appear here.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
