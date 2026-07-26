import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { Icon } from "@/components/ui/Icon";
import { demoProjects } from "@/data/portal-demo";

export function PortalTopbar({ sessionLabel }: { sessionLabel: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line bg-paper px-4 sm:px-6">
      <PortalSidebar />
      <p className="font-display text-sm font-semibold text-ink">Client Portal</p>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <label className="hidden sm:block">
          <span className="sr-only">Select project</span>
          <select className="field-control min-h-[2.25rem] py-1.5 text-xs" defaultValue={demoProjects[0]?.name}>
            {demoProjects.map((project) => (
              <option key={project.id}>{project.name}</option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate transition-colors hover:bg-mist"
        >
          <Icon name="Bell" className="h-5 w-5" label="Notifications" />
        </button>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate transition-colors hover:bg-mist"
        >
          <Icon name="HelpCircle" className="h-5 w-5" label="Help" />
        </button>

        <span className="flex items-center gap-2 rounded-md border border-line px-2.5 py-1.5">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-haze">
            <Icon name="UserRound" className="h-3.5 w-3.5 text-muted" />
          </span>
          <span className="hidden text-xs font-medium text-ink sm:inline">{sessionLabel}</span>
        </span>
      </div>
    </header>
  );
}
