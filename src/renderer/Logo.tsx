import { type ComponentPropsWithoutRef } from "react";

export default function Logo({
  width = 690,
  height = 690,
  ...props
}: ComponentPropsWithoutRef<"svg"> & {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 690 690"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <linearGradient
        id="linearGradient1"
        x1="184.22502"
        y1="245.76491"
        x2="764.92291"
        y2="826.46283"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(-193.55552,-129.3335)"
      >
        <stop offset="0.00286" stopColor="#2469fe" stopOpacity="1" />
        <stop offset="1" stopColor="#065ee2" stopOpacity="1" />
        <stop offset="1" stopColor="#0e85b8" stopOpacity="1" />
        <stop offset="1" stopColor="#15a396" stopOpacity="1" />
        <stop offset="1" stopColor="#1ab97f" stopOpacity="1" />
        <stop offset="1" stopColor="#1dc670" stopOpacity="1" />
        <stop offset="1" stopColor="#173ae1" stopOpacity="1" />
      </linearGradient>
      <path
        fill="url(#linearGradient1)"
        stroke="none"
        d="M 535.29562,688.88917 H 294.40709 c -63.32955,0 -114.8515,-51.52247 -114.8515,-114.85254 V 544.59229 H 162.8515 C 99.52195,544.59229 48,493.06983 48,429.74073 V 100.77735 C 48,45.208496 93.208473,0 148.77778,0 204.34659,0 249.55555,45.208496 249.55555,100.77735 v 373.81494 h 285.74007 c 59.082,0 107.14838,48.06641 107.14838,107.14844 0,59.08203 -48.06638,107.14844 -107.14838,107.14844 z M 249.55555,544.59229 v 29.44434 c 0,24.73144 20.1201,44.85254 44.85154,44.85254 h 240.88853 c 20.48339,0 37.14842,-16.66504 37.14842,-37.14844 0,-20.4834 -16.66503,-37.14844 -37.14842,-37.14844 z M 148.77778,70.000006 c -16.97119,0 -30.77782,13.80664 -30.77782,30.777344 v 328.96338 c 0,24.73144 20.12011,44.85156 44.85154,44.85156 h 16.70409 V 100.77735 c 0,-16.970704 -13.80663,-30.777344 -30.77781,-30.777344 z"
        style={{ fill: "url(#linearGradient1)" }}
      />
    </svg>
  );
}
