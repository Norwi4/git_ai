import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { repositories } from "@/lib/data";
import { type Repository } from "@/lib/types";
import { Code, Star, GitFork, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title="Dashboard"
        description="Your repositories at a glance."
      >
        <Button>New repository</Button>
      </PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repositories.map((repo) => (
          <RepositoryCard key={repo.id} repo={repo} />
        ))}
      </div>
    </div>
  );
}

function RepositoryCard({ repo }: { repo: Repository }) {
  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline text-xl">
                    <Link href={`/repository/${repo.id}`} className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring rounded-sm p-1 -m-1">
                        {repo.name}
                    </Link>
                </CardTitle>
                <CardDescription className="mt-1 line-clamp-2">{repo.description}</CardDescription>
            </div>
            <Link href={`/repository/${repo.id}`} className="shrink-0" aria-label={`View ${repo.name} repository`}>
                <Button variant="ghost" size="icon">
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </Link>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex items-end justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5" title="Language">
            <Code className="h-4 w-4 text-primary" />
            <span>{repo.language}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Stars">
            <Star className="h-4 w-4 text-primary" />
            <span>{repo.stars}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Forks">
            <GitFork className="h-4 w-4 text-primary" />
            <span>{repo.forks}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
