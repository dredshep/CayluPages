import { SVGProps } from "react";

interface CartIconProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
}

const CartIcon = ({ width = 53, height = 53, ...props }: CartIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      d="M15.459 48.583c-1.215 0-2.255-.432-3.119-1.296-.864-.864-1.297-1.904-1.298-3.12 0-1.215.433-2.254 1.298-3.119.866-.864 1.905-1.297 3.119-1.298 1.214 0 2.254.433 3.12 1.298.866.866 1.298 1.906 1.296 3.119 0 1.214-.432 2.254-1.296 3.12-.864.866-1.904 1.298-3.12 1.296Zm22.083 0c-1.215 0-2.254-.432-3.118-1.296-.864-.864-1.297-1.904-1.299-3.12 0-1.215.433-2.254 1.299-3.119.865-.864 1.905-1.297 3.118-1.298 1.214 0 2.255.433 3.12 1.298.866.866 1.298 1.906 1.297 3.119 0 1.214-.433 2.254-1.297 3.12-.864.866-1.904 1.298-3.12 1.296ZM13.582 13.25l5.3 11.042H34.34l6.073-11.042H13.58Zm-2.099-4.417h32.573c.847 0 1.491.378 1.933 1.133.441.756.46 1.519.055 2.29l-7.84 14.134a4.425 4.425 0 0 1-1.627 1.711 4.294 4.294 0 0 1-2.237.607H17.888l-2.43 4.417h26.5v4.417h-26.5c-1.656 0-2.907-.727-3.754-2.18-.846-1.453-.883-2.898-.11-4.335l2.981-5.41-7.95-16.784H2.208V4.417h7.178l2.098 4.416Z"
    />
  </svg>
);

export default CartIcon;
