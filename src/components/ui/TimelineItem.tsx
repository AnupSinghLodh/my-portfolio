import type { TimelineEntry } from "../../types";

type TimelineItemProps = { entry: TimelineEntry };

export default function TimelineItem({ entry }: TimelineItemProps) {
  return (
    <div className="relative pl-8 md:pl-10">
      <span
        aria-hidden="true"
        className="absolute -left-[4.5px] top-1.5 size-2.5 rounded-full bg-ember shadow-[0_0_12px_var(--color-ember)]"
      />
      <p className="font-mono text-xs text-muted">{entry.period}</p>
      <h3 className="mt-1 font-semibold text-ink">{entry.title}</h3>
      <p className="mt-1 text-sm text-muted">{entry.detail}</p>
    </div>
  );
}
