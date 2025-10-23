import { type Commit } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function CommitList({ commits }: { commits: Commit[] }) {
  return (
    <div className="space-y-4">
      {commits.map((commit) => (
        <Card key={commit.hash} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={commit.avatarUrl} alt={commit.author} />
                <AvatarFallback>{commit.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{commit.message}</p>
                <p className="text-sm text-muted-foreground">
                  {commit.author} committed {commit.date}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="font-mono">{commit.hash.substring(0, 7)}</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
