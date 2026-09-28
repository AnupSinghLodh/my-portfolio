type TagProps = { label: string };

export default function Tag({ label }: TagProps) {
  return (
    <li className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-xs text-muted">{label}</li>
  );
}
