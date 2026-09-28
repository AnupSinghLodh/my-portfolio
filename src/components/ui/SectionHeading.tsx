type SectionHeadingProps = { eyebrow: string; title: string; id: string };

export default function SectionHeading({ eyebrow, title, id }: SectionHeadingProps) {
  return (
    <div className="mb-10 max-w-2xl md:mb-14">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-ember">{eyebrow}</p>
      <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance text-ink md:text-5xl">
        {title}
      </h2>
    </div>
  );
}
