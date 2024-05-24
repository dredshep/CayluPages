import { SVGProps } from "react";
const TwitterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="M36.982 6.25h6.39l-13.96 15.885L45.835 43.75H32.975L22.907 30.64 11.384 43.75H4.988l14.931-16.99L4.167 6.25H17.35l9.104 11.983L36.983 6.25ZM34.74 39.942h3.542L15.425 9.858h-3.8L34.74 39.942Z"
    />
  </svg>
);
export default TwitterIcon;
