import { useState } from "react";

import { CopyIcon } from "../icons/Copy";
import { Tooltip, TooltipContainer } from "./Tooltip";

export const AccountAddress = ({ address }: { address: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <kbd className="whitespace-nowrap">
      {address}{" "}
      <TooltipContainer>
        <button
          className="m-0 cursor-pointer border-none bg-none p-0"
          onClick={async () => {
            await navigator.clipboard.writeText(address);
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
    </kbd>
  );
};
