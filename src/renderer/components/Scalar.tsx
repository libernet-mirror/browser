import { useState } from "react";

import { CopyIcon } from "../icons/Copy";
import { Tooltip, TooltipContainer } from "./Tooltip";

export const Scalar = ({
  value,
  maxLength = 0,
}: {
  value: string;
  maxLength?: number;
}) => {
  const [copied, setCopied] = useState(false);
  return (
    <span className="whitespace-nowrap">
      <kbd>{maxLength ? <>{value.slice(0, maxLength)}&hellip;</> : value}</kbd>{" "}
      <TooltipContainer>
        <button
          className="m-0 cursor-pointer border-none bg-none p-0"
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
          }}
          onMouseLeave={() => setCopied(false)}
        >
          <CopyIcon className="inline size-4" />
        </button>
        <Tooltip anchor="middle">
          {copied ? "Copied!" : "Copy to clipboard"}
        </Tooltip>
      </TooltipContainer>
    </span>
  );
};
