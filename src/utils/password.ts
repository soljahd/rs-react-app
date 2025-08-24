export interface PasswordStrength {
  length: boolean;
  upper: boolean;
  lower: boolean;
  digit: boolean;
  special: boolean;
  score: number;
}

export const calcPasswordStrength = (pwd: string): PasswordStrength => {
  const upper = /[A-Z]/.test(pwd);
  const lower = /[a-z]/.test(pwd);
  const digit = /\d/.test(pwd);
  const special = /[^A-Za-z0-9]/.test(pwd);
  const length = pwd.length >= 8;
  const checks = [upper, lower, digit, special, length];
  const score = checks.filter(Boolean).length;
  return { upper, lower, digit, special, length, score };
};
