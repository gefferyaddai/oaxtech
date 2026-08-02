import { Icon } from "@/components/ui/Icon";
import { DEMO_NOTICE } from "@/data/demo-data";

/** Persistent, unmissable notice that nothing in the portal is real. */
export function DemoBanner() {
  return (
    <div className="flex items-start gap-2.5 border-b border-warning/25 bg-warning-soft px-4 py-2.5 sm:px-6">
      <Icon name="AlertTriangle" className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <p className="text-xs leading-relaxed text-charcoal">
        <span className="font-semibold">Demo mode.</span>{" "}
        {DEMO_NOTICE.replace(/^Demo data\.\s*/, "")}
      </p>
    </div>
  );
}
