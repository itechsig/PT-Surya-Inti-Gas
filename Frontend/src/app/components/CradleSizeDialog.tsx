import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { ProductVariant } from "../../data/products";

/**
 * Size picker for the collapsed "Cradle" card. The grid shows a single Cradle
 * card without any size; the sizes (2x2, 3x2, 3x3, 4x4) only appear here on click.
 */
export function CradleSizeDialog({
  variants,
  onSelect,
  onClose,
}: {
  variants: ProductVariant[];
  onSelect: (variant: ProductVariant) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = dialogRef.current;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && node) {
        const focusables = node.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    node?.querySelector<HTMLElement>(".cradle-size-option")?.focus();

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="cradle-size-backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          ref={dialogRef}
          className="cradle-size-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cradle-size-title"
          aria-describedby="cradle-size-desc"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        >
          <button
            type="button"
            className="cradle-size-close"
            onClick={onClose}
            aria-label={t("common.close")}
          >
            <X size={20} aria-hidden="true" />
          </button>

          <h3 id="cradle-size-title" className="cradle-size-heading">
            {t("products.cradleGroup.dialogTitle")}
          </h3>
          <p id="cradle-size-desc" className="cradle-size-subheading">
            {t("products.cradleGroup.dialogDescription")}
          </p>

          <div className="cradle-size-options">
            {variants.map((variant) => (
              <button
                key={variant.label}
                type="button"
                className="cradle-size-option"
                onClick={() => onSelect(variant)}
                aria-label={t("common.selectSizeAria", { size: variant.label })}
              >
                <span>{variant.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
