export const AVATAR_VIEWBOX = "0 0 240 280";

export interface AvatarAppearance {
  skinColor: string;
  hairColor: string;
  eyeColor: string;
  hairstyleId: string;
  outfitId: string;
}

export const DEFAULT_AVATAR_APPEARANCE: AvatarAppearance = {
  skinColor: "#D99B73",
  hairColor: "#5b382800",
  eyeColor: "#659b7502",
  hairstyleId: "basic",
  outfitId: "basic",
};
