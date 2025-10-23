"use client";

import { useState } from "react";
import type { Issue } from "@/lib/types";
import { prioritizeIssues } from "@/ai/flows/prioritize-issues";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function IssueList({ initialIssues }: { initialIssues: Issue[] }) {
  const [issues, setIssues] = useState<Issue[]>(initialIssues);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePrioritize = async () => {
    setIsLoading(true);
    try {
      const issueDescriptions = issues.map(i => `${i.title}: ${i.id}`);
      const prioritized = await prioritizeIssues({
        currentBranch: 'feature/new-ui',
        issues: issueDescriptions,
        projectDetails: 'This is a Next.js project with TypeScript and Tailwind CSS.',
      });

      const updatedIssues = issues.map(issue => {
        const prioritizedIssue = prioritized.find(p => p.issue === `${issue.title}: ${issue.id}`);
        if (prioritizedIssue) {
          return { ...issue, relevanceScore: prioritizedIssue.relevanceScore, reason: prioritizedIssue.reason };
        }
        return issue;
      }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
      
      setIssues(updatedIssues);
      toast({
        title: "Issues prioritized",
        description: "AI has successfully prioritized your issues.",
      });

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Prioritization failed",
        description: "Could not prioritize issues. Please try again.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handlePrioritize} disabled={isLoading}>
          {isLoading ? (
            <Activity className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Prioritize with AI
        </Button>
      </div>
      <div className="space-y-4">
        {issues.map((issue) => (
          <Card key={issue.id} className="transition-all">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="font-headline text-lg">{issue.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground mt-1">
                      #{issue.id} opened {issue.createdAt} by {issue.author}
                    </CardDescription>
                  </div>
                  <Badge variant={issue.state === 'open' ? 'secondary' : 'default'} className={issue.state === 'open' ? '' : 'bg-green-600 text-white'}>
                      {issue.state}
                  </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {issue.labels.map(label => <Badge key={label} variant="outline" className="mr-2 mb-2">{label}</Badge>)}
            </CardContent>
            {issue.relevanceScore !== undefined && (
                <CardFooter>
                    <Alert variant={issue.relevanceScore > 0.7 ? "default" : "destructive"} className={issue.relevanceScore > 0.7 ? "border-primary" : ""}>
                        <Sparkles className="h-4 w-4" />
                        <AlertTitle>AI Prioritization (Score: {issue.relevanceScore.toFixed(2)})</AlertTitle>
                        <AlertDescription>
                            {issue.reason}
                        </AlertDescription>
                    </Alert>
                </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
