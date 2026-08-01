"use client";

import { CopyButton, useCopyToClipboard } from "@/components/ui/copy-button";

export function Field({
  label,
  value,
  copyValue = value,
}: {
  label: string;
  value: string;
  copyValue?: string;
}) {
  const { copied, copy } = useCopyToClipboard();

  function handleCopy() {
    copy(copyValue);
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-hairline py-4 last:border-0">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-[14px] leading-[1.43] tracking-[-0.224px] text-ink-muted-48">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="group -mx-2 w-fit wrap-anywhere text-start active:scale-[0.98]"
        >
          <span
            className={`[box-decoration-break:clone] [-webkit-box-decoration-break:clone] rounded-sm px-2 py-0 text-[19px] font-medium leading-[1.3] tracking-wide tabular-nums transition-colors ${
              copied ? "bg-primary/10 text-primary" : "bg-transparent text-ink group-hover:bg-surface-pearl"
            }`}
          >
            {value}
          </span>
        </button>
      </div>
      <CopyButton copied={copied} onClick={handleCopy} />
    </div>
  );
}
