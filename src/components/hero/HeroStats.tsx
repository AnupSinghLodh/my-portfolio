import type { Stat } from "../../types";
import StatItem from "../ui/StatItem";

type HeroStatsProps = { stats: Stat[] };

export default function HeroStats({ stats }: HeroStatsProps) {
  return (
    <dl className="mt-14 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-6">
      {stats.map((stat) => (
        <StatItem key={stat.label} stat={stat} />
      ))}
    </dl>
  );
}
