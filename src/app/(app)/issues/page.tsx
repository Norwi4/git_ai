import { PageHeader } from "@/components/page-header";
import { issues } from "@/lib/data";
import { IssueList } from "@/components/issues/issue-list";

export default function IssuesPage() {
  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title="Issues"
        description="Track and manage issues for your project."
      />
      <IssueList initialIssues={issues} />
    </div>
  );
}
