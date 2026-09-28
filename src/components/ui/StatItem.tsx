import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import type { Stat } from "../../types";
import CountUp from "../reactbits/CountUp";

type StatItemProps = { stat: Stat };

export default function StatItem({ stat }: StatItemProps) {
  const reducedMotion = usePrefersReducedMotion();
  const finalValue = `${stat.value}${stat.suffix ?? ""}`;

  return (
    <div className="flex flex-col-reverse gap-1">
      <dt className="text-xs uppercase tracking-wider text-muted">{stat.label}</dt>
      <dd className="font-mono text-2xl font-semibold text-ink md:text-3xl">
        <span className="sr-only">{finalValue}</span>
        <span aria-hidden="true">
          {reducedMotion ? finalValue : (
            <>
              <CountUp to={stat.value} duration={1.6} />
              {stat.suffix}
            </>
          )}
        </span>
      </dd>
    </div>
  );
}
