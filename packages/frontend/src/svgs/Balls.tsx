import { FC, SVGAttributes } from "react";

export const Ball: React.FC<SVGAttributes<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 32 32" {...props}>
      <circle cx="16" cy="16" r="16" fill={props.color} />
      <g style={{ mixBlendMode: "multiply" }} opacity="0.1">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24.3428 3.13232C28.9191 8.87177 28.5505 17.2573 23.2373 22.5706C17.528 28.2799 8.27148 28.2799 2.56223 22.5706C2.2825 22.2909 2.01648 22.0026 1.76416 21.7067C4.02814 27.3486 9.54881 31.3326 16 31.3326C24.4683 31.3326 31.3332 24.4677 31.3332 15.9994C31.3332 10.6078 28.5504 5.8661 24.3428 3.13232Z"
          fill="black"
        />
      </g>
      <g style={{ mixBlendMode: "multiply" }} opacity="0.1">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25.7713 4.18262C30.6308 10.2119 30.2607 19.061 24.6609 24.6608C19.0615 30.2602 10.2132 30.6307 4.18396 25.7722C6.99643 29.1689 11.2455 31.3329 16 31.3329C24.4683 31.3329 31.3332 24.468 31.3332 15.9997C31.3332 11.2446 29.1687 6.99508 25.7713 4.18262Z"
          fill="black"
        />
      </g>
      <g style={{ mixBlendMode: "soft-light" }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.48969 24.8677C0.151051 18.7651 0.974979 11.0636 6.01931 6.01927C11.0639 0.974682 18.7659 0.15093 24.8687 3.49016C22.365 1.71201 19.3046 0.666603 16 0.666603C7.53165 0.666603 0.666733 7.53152 0.666733 15.9998C0.666733 19.3041 1.7119 22.3642 3.48969 24.8677Z"
          fill="white"
        />
      </g>
      <g style={{ mixBlendMode: "soft-light" }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.10075 9.5143C3.77271 5.93677 6.78528 3.11129 10.4921 1.68422C10.546 1.73235 10.5987 1.78219 10.6502 1.83374C12.4838 3.66728 10.9119 5.7442 8.66145 7.99465C6.411 10.2451 4.33417 11.8169 2.50064 9.98335C2.35338 9.83609 2.22013 9.6793 2.10075 9.5143Z"
          fill="white"
        />
      </g>
    </svg>
  );
};

interface BallWithNumberProps {
  color: string;
  number: string;
  size?: string;
  fontSize?: string;
  rotationTransform?: number;
}

export const BallWithNumber: FC<BallWithNumberProps> = ({
  color,
  number,
  fontSize,
  rotationTransform,
  size,
}) => {
  return (
    <div className="relative flex items-center justify-center mx-2">
      <Ball width={72} height={72} color={color} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <label className="text-black font-bold text-2xl">{number}</label>
      </div>
    </div>
  );
};
