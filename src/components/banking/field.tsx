"use client";

import { CopyButton, useCopyToClipboard } from "@/components/ui/copy-button";

export function Field({
  label,
  value,
  copyValue = value,
  copyDisabled = false
}: {
  label: string;
  value: string;
  copyValue?: string;
  copyDisabled?: boolean;
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
        {copyDisabled ? (
          <span className="-mx-2 w-fit whitespace-nowrap rounded-sm px-2 py-0 text-[15px] font-medium leading-[1.3] tracking-wide tabular-nums text-ink sm:wrap-anywhere sm:whitespace-normal sm:text-[19px]">
            {value}
          </span>
        ) : (
          <button
            type="button"
            onClick={handleCopy}
            className="group -mx-2 w-fit wrap-anywhere text-start active:scale-[0.98]"
          >
            <span
              className={`[box-decoration-break:clone] [-webkit-box-decoration-break:clone] whitespace-nowrap rounded-sm px-2 py-0 text-[15px] font-medium leading-[1.3] tracking-wide tabular-nums transition-colors sm:wrap-anywhere sm:whitespace-normal sm:text-[19px] ${copied ? "bg-primary/10 text-primary" : "bg-transparent text-ink group-hover:bg-surface-pearl"
                }`}
            >
              {value}
            </span>
          </button>
        )}
      </div>
      {!copyDisabled && <CopyButton copied={copied} onClick={handleCopy} />}
    </div>
  );
}
