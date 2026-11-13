interface BodyLayerProps {
  skinColor: string;
}

export const BodyLayer = ({ skinColor }: BodyLayerProps) => (
  <g
    stroke="#49352F"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="3"
  >
    <ellipse cx="120" cy="263" rx="52" ry="7" fill="#D9E7DF" stroke="none" />

    <ellipse cx="63" cy="99" rx="11" ry="14" fill={skinColor} />
    <ellipse cx="177" cy="99" rx="11" ry="14" fill={skinColor} />
    <path
      d="M120 24c-34 0-57 25-57 64 0 39 22 66 57 66s57-27 57-66c0-39-23-64-57-64z"
      fill={skinColor}
    />

    <path d="M104 145v20c0 8 7 14 16 14s16-6 16-14v-20" fill={skinColor} />
    <path
      d="M91 240v14c0 6 5 10 11 10h10c6 0 10-4 10-10v-14m-1 0v14c0 6 4 10 10 10h10c6 0 11-4 11-10v-14"
      fill={skinColor}
    />

    <path
      d="M82 160c-7 3-13 9-17 17l-10 24c-2 5 0 10 5 12 5 2 10 0 12-5l12-25m72-23c7 3 13 9 17 17l10 24c2 5 0 10-5 12-5 2-10 0-12-5l-12-25"
      fill={skinColor}
    />
    <path
      d="M58 203l-3 7m8-5-3 7m122-9 3 7m-8-5 3 7"
      fill="none"
      strokeWidth="2"
    />

    <ellipse
      cx="82"
      cy="126"
      rx="10"
      ry="5"
      fill="#E99288"
      opacity=".3"
      stroke="none"
    />
    <ellipse
      cx="158"
      cy="126"
      rx="10"
      ry="5"
      fill="#E99288"
      opacity=".3"
      stroke="none"
    />
  </g>
);
