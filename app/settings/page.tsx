"use client";
import { Panel } from "@/components/ui/Panel";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <div className="label">System · Sector 00</div>
        <h1 className="text-3xl font-semibold tracking-tight holo-text">Configuration</h1>
      </header>
      <Panel title="Storage" subtitle="Local persistence">
        <p className="text-sm text-nx-dim">
          NEXUS stores all data in your browser via localStorage. Clearing site data resets the system.
        </p>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("nexus-os-store");
              location.reload();
            }
          }}
          className="btn mt-3"
        >Reset all data</button>
      </Panel>
      <Panel title="About">
        <p className="text-sm text-nx-dim">
          NEXUS · Personal OS · cinematic command center for ambitious operators.
        </p>
      </Panel>
    </div>
  );
}
