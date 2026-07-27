export function FeatureCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="feature-card flex flex-col items-start gap-[12px] p-[20px] w-full text-left">
      <div className="feature-icon-badge">{icon}</div>
      <div className="flex flex-col gap-[6px]">
        <p className="font-semibold text-[16px] leading-[19px]" style={{ color: "#FCF8FA" }}>
          {title}
        </p>
        <p className="text-[12px] leading-[15px] font-normal" style={{ color: "#F7DDEB" }}>
          {desc}
        </p>
      </div>
    </button>
  );
}
