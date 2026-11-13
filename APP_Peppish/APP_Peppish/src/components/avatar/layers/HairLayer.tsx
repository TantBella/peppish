interface HairLayerProps {
  hairColor: string;
}

export const HairLayer = ({ hairColor }: HairLayerProps) => (
  <g
    fill={hairColor}
    stroke="#49352f05"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="3"
  >
    <path d="M66 94c-3-9-4-18-4-27 0-31 23-51 58-51s58 20 58 51c0 9-1 18-4 27-9-3-16-9-21-18-8 9-19 14-33 14s-25-5-33-14c-5 9-12 15-21 18z" />
  </g>
);
