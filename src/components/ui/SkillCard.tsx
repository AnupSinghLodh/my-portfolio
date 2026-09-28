import type { SkillGroup } from "../../types";
import SpotlightCard from "../reactbits/SpotlightCard";
import Tag from "./Tag";

type SkillCardProps = { group: SkillGroup };

export default function SkillCard({ group }: SkillCardProps) {
  return (
    <SpotlightCard className="h-full p-6">
      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-ember">{group.title}</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {group.items.map((item) => (
          <Tag key={item} label={item} />
        ))}
      </ul>
    </SpotlightCard>
  );
}
