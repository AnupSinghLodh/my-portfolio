import type { Achievement } from "../../types";
import SpotlightCard from "../reactbits/SpotlightCard";

type AchievementCardProps = { achievement: Achievement };

export default function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <SpotlightCard className="p-6">
      <h3 className="font-semibold text-ink">{achievement.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{achievement.body}</p>
    </SpotlightCard>
  );
}
