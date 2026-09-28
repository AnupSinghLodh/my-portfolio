import type { ProcessStepData } from "../../types";

type ProcessStepProps = { step: ProcessStepData; index: number };

export default function ProcessStep({ step, index }: ProcessStepProps) {
  return (
    <div className="border-t border-line pt-5">
      <span className="font-mono text-xs text-ember">{String(index + 1).padStart(2, "0")}</span>
      <h4 className="mt-2 font-semibold text-ink">{step.title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
    </div>
  );
}
