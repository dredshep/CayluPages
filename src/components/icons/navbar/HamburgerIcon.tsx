import cn from "classnames";
export default function LocationIcon({
  className,
  stroke,
}: {
  className?: string;
  stroke?: string;
}) {
  return (
    <svg
      // width="70"
      // height="70"
      viewBox="0 0 70 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn({
        // if classnames include height and width, then use them, otherwise use the default
        [className ?? ""]: className,
        "h-[70px] w-[70px]":
          !className?.includes("h-") && !className?.includes("w-"),
      })}
    >
      <g id="iconamoon:menu-burger-horizontal">
        <path
          id="Vector"
          d="M8.75 17.5H61.25M8.75 35H61.25M8.75 52.5H61.25"
          stroke={stroke ?? "white"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
