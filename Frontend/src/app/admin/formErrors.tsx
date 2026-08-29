import { useEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';

export type FormErrors = Record<string, string[]>;

/**
 * Props to spread on an <Input>/<Textarea>/<SelectTrigger> so screen readers
 * announce the field as invalid and the shadcn `aria-invalid:` styling
 * (red border) kicks in. Pairs with <FieldError> for the visible message and
 * <FormErrorSummary> for the announced list.
 */
export function fieldErrorProps(errors: FormErrors, key: string) {
  return {
    'aria-invalid': errors[key]?.length ? true : undefined,
  } as const;
}

/** Inline error message rendered directly under its field. */
export function FieldError({ errors, name }: { errors: FormErrors; name: string }) {
  const message = errors[name]?.[0];
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

/**
 * A focusable summary placed at the top of a form. When a submit fails and
 * `errors` becomes non-empty it takes focus, so keyboard and screen-reader
 * users are told what went wrong instead of being left on the submit button.
 * (WCAG 2.2 — Error Identification / focus management.)
 */
export function FormErrorSummary({ errors }: { errors: FormErrors }) {
  const ref = useRef<HTMLDivElement>(null);
  const messages = Object.values(errors).flatMap((list) => (list?.length ? [list[0]] : []));

  useEffect(() => {
    if (messages.length > 0) ref.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors]);

  if (messages.length === 0) return null;

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      className="mb-1 flex flex-col gap-1 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive outline-none"
    >
      <span className="flex items-center gap-2 font-medium">
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        Periksa kembali {messages.length} isian berikut
      </span>
      <ul className="ml-6 list-disc">
        {messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
