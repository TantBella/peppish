interface EyesLayerProps {
  eyeColor: string;
}

export const EyesLayer = ({ eyeColor }: EyesLayerProps) => (
  <g stroke="#49352f0a" strokeLinecap="round" strokeLinejoin="round">
    <path
      d="M82 87c6-5 14-5 20 0m36 0c6-5 14-5 20 0"
      fill="none"
      strokeWidth="3"
    />

    <ellipse
      cx="97"
      cy="103"
      rx="10"
      ry="13"
      fill="#fffdf811"
      strokeWidth="2"
    />
    <ellipse
      cx="143"
      cy="103"
      rx="10"
      ry="13"
      fill="#fffdf811"
      strokeWidth="2"
    />
    <ellipse cx="98" cy="104" rx="6" ry="9" fill={eyeColor} stroke="none" />
    <ellipse cx="142" cy="104" rx="6" ry="9" fill={eyeColor} stroke="none" />
    <ellipse cx="99" cy="106" rx="3" ry="6" fill="#302b2a18" stroke="none" />
    <ellipse cx="141" cy="106" rx="3" ry="6" fill="#302b2a09" stroke="none" />
    <circle cx="100" cy="100" r="2.5" fill="#ffffff0a" stroke="none" />
    <circle cx="142" cy="100" r="2.5" fill="#ffffff06" stroke="none" />

    <path
      d="M116 118c2 2 6 2 8 0m-12 12c4 4 12 4 16 0"
      fill="none"
      strokeWidth="2"
    />
  </g>
);
