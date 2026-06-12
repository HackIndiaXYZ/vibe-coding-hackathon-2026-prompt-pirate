import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · ProductJudge AI" }] }),
  component: Settings,
});

function Settings() {
  return (
    <AppShell>
      <div className="mb-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
          Workspace
        </div>
        <h1 className="mt-2 font-display text-5xl tracking-tight">Settings</h1>
      </div>
      <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-8 text-muted-foreground">
        Workspace, team and API settings coming soon.
      </div>
    </AppShell>
  );
}
