import type { Role } from "../../types";
import SpotlightCard from "../reactbits/SpotlightCard";
import Stagger from "./Stagger";
import StaggerItem from "./StaggerItem";

type RoleCardProps = { role: Role };

export default function RoleCard({ role }: RoleCardProps) {
  return (
    <SpotlightCard className="p-6 md:p-10">
      <div className="flex flex-col gap-2 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-ink">{role.title}</h3>
          <p className="mt-1 text-ember-soft">{role.company}</p>
        </div>
        <p className="font-mono text-xs text-muted">
          {role.period} · {role.location}
        </p>
      </div>
      <Stagger as="ul" className="mt-6 grid gap-6 md:grid-cols-2">
        {role.bullets.map((bullet) => (
          <StaggerItem as="li" key={bullet.title}>
            <h4 className="font-medium text-ink">{bullet.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted">{bullet.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </SpotlightCard>
  );
}
