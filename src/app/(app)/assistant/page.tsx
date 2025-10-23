import { PageHeader } from "@/components/page-header";
import { CodeAssistant } from "@/components/assistant/code-assistant";

export default function AssistantPage() {
  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title="AI Code Assistant"
        description="Get inline code suggestions and assistance."
      />
      <CodeAssistant />
    </div>
  );
}
