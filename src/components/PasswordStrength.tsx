import { calcPasswordStrength } from '../utils/password';

function PasswordStrength({ password }: { password: string }) {
  const s = calcPasswordStrength(password);
  const scorePercentage = Math.min(Math.max((s.score / 5) * 100, 0), 100);
  const labels = [
    ['length', 'At least 8 chars', s.length],
    ['upper', '1 uppercase', s.upper],
    ['lower', '1 lowercase', s.lower],
    ['digit', '1 number', s.digit],
    ['special', '1 special char', s.special],
  ] as const;

  return (
    <div className="space-y-2">
      <div className="h-2 w-full rounded bg-gray-200">
        <div
          className="h-2 rounded transition-all"
          style={{
            width: `${scorePercentage.toString()}%`,
            background: 'linear-gradient(to right, #60a5fa, #2563eb)',
          }}
        />
      </div>
      <ul className="grid grid-cols-2 gap-1 text-sm">
        {labels.map(([k, label, ok]) => (
          <li key={k} className={ok ? 'text-green-700' : 'text-gray-600'}>
            • {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PasswordStrength;
