export function SectionLabel({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <div className="mono-label flex items-center gap-3">
      <span className="text-fg-lo">{index}</span>
      <span className="h-px w-8 bg-line-hi" />
      <span>{label}</span>
    </div>
  );
}
