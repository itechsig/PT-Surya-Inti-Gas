import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../components/ui/input';

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  required?: boolean;
  /** Marks the field invalid (red border + announced to screen readers). */
  invalid?: boolean;
}

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  required,
  invalid,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        maxLength={255}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-10"
        aria-invalid={invalid || undefined}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
        aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
}
