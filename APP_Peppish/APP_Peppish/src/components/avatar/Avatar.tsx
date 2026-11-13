import {
  AVATAR_VIEWBOX,
  DEFAULT_AVATAR_APPEARANCE,
  type AvatarAppearance,
} from "./types";
import { BodyLayer } from "./layers/BodyLayer";
import { EyesLayer } from "./layers/EyesLayer";
import { HairLayer } from "./layers/HairLayer";
import { OutfitLayer } from "./layers/OutfitLayer";

interface AvatarProps {
  appearance?: Partial<AvatarAppearance>;
  className?: string;
}

export const Avatar = ({ appearance, className }: AvatarProps) => {
  const config = { ...DEFAULT_AVATAR_APPEARANCE, ...appearance };

  return (
    <svg
      className={className}
      viewBox={AVATAR_VIEWBOX}
      role="img"
      aria-label="Peppish-avatar"
      xmlns="http://www.w3.org/2000/svg"
    >
      <BodyLayer skinColor={config.skinColor} />
      <OutfitLayer />
      <HairLayer hairColor={config.hairColor} />
      <EyesLayer eyeColor={config.eyeColor} />
    </svg>
  );
};
