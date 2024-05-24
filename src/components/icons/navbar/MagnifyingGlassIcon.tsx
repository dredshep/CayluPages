import { SVGProps } from "react";

interface MagnifyingGlassIconProps extends SVGProps<SVGSVGElement> {
  height?: number;
  width?: number;
}

const MagnifyingGlassIcon = ({
  height = 40,
  width = 40,
  ...props
}: MagnifyingGlassIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      fillRule="evenodd"
      d="M10.005 18.01a8.007 8.007 0 1 1 16.014 0 8.007 8.007 0 0 1-16.014 0ZM18.01 6a12.01 12.01 0 1 0 6.958 21.8l5.639 5.638a2.001 2.001 0 0 0 2.83-2.83l-5.637-5.637A12.011 12.011 0 0 0 18.012 6Z"
      clipRule="evenodd"
    />
  </svg>
);

export default MagnifyingGlassIcon;
