interface LogoSquareProps {
  size?: 'sm' | 'md' | 'lg';
}

export default function LogoSquare({ size = 'md' }: LogoSquareProps) {
  return (
    <div className="flex items-center space-x-1.5 font-sans text-2xl font-black uppercase tracking-tight">
      <span>Simple</span>
      <span className="text-accent-500">Interior</span>
      <span>Ideas</span>
    </div>
  );
}
