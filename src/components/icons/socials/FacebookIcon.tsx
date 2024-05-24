import { SVGProps } from "react";
const FacebookIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M45.834 25C45.834 13.5 36.5 4.166 25 4.166S4.167 13.5 4.167 25c0 10.083 7.167 18.479 16.667 20.416V31.25h-4.167V25h4.167V19.79c0-4.02 3.27-7.291 7.291-7.291h5.209v6.25h-4.167a2.09 2.09 0 0 0-2.083 2.083V25h6.25v6.25h-6.25v14.479c10.52-1.042 18.75-9.917 18.75-20.73Z"
    />
  </svg>
);
export default FacebookIcon;
