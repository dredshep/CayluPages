import { SVGProps } from "react";
import CaretLeft from "./CaretLeft";
const CaretRight = (props: SVGProps<SVGSVGElement>) => (
  <CaretLeft {...props} transform="scale(-1, 1)" />
);
export default CaretRight;
