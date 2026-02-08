"use client";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  variant?: "danger" | "default";
}

export function ConfirmDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  variant = "danger",
}: ConfirmDialogProps) {
  if (!open) return null;

  function handleConfirm() {
    onConfirm();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-desc"
    >
      <div
        className="absolute inset-0 bg-ink-900/50 dark:bg-ink-950/70"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-sm rounded-lg border border-ink-200 bg-white p-4 shadow-lg dark:border-ink-600 dark:bg-ink-800">
        <h2
          id="confirm-dialog-title"
          className="text-lg font-semibold text-ink-900 dark:text-ink-50"
        >
          {title}
        </h2>
        <p
          id="confirm-dialog-desc"
          className="mt-2 text-sm text-ink-600 dark:text-ink-300"
        >
          {message}
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:border-ink-600 dark:bg-ink-700 dark:text-ink-200 dark:hover:bg-ink-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={
              variant === "danger"
                ? "rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
                : "rounded-md bg-ink-800 px-3 py-2 text-sm font-medium text-white hover:bg-ink-900 dark:bg-ink-200 dark:text-ink-900 dark:hover:bg-ink-100"
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
