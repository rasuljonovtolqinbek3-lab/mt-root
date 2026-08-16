import { PageWrapper } from "@/components/layout/page-wrapper";
import { Eye } from "lucide-react";

export default function Page() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 text-center">
        <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-4 mb-6">
          <Eye className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-3">OSINT</h1>
        <p className="text-text-secondary max-w-lg mx-auto">Open source intelligence gathering techniques.</p>
        <div className="mt-8 rounded-lg border border-border bg-surface p-4 font-mono text-xs text-text-muted text-left max-w-md mx-auto">
          <span className="text-primary">$</span> status: placeholder<br />
          <span className="text-primary">$</span> phase: upcoming<br />
          <span className="text-primary">$</span> backend: not yet implemented
        </div>
      </div>
    </PageWrapper>
  );
}
