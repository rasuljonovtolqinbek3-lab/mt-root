import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function BannedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-4">
        <ShieldAlert className="mx-auto h-16 w-16 text-accent-red" />
        <h1 className="text-2xl font-bold text-text-primary">Access Restricted</h1>
        <p className="text-text-secondary max-w-md mx-auto">This account has been banned from MT_ROOT.</p>
        <Link href="/" className="inline-block rounded-lg bg-primary/10 px-6 py-2 text-sm text-primary hover:bg-primary/20 transition-colors">Return Home</Link>
      </div>
    </div>
  );
}
