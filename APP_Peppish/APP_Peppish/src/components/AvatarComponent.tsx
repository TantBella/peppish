import basebodySvg from "../assets/avatars/base/basebody.svg?raw";

import eyebrowsSvg from "../assets/avatars/face/eyebrows.svg?raw";
import eyesSvg from "../assets/avatars/face/eyes.svg?raw";
import freckles from "../assets/avatars/face/freckles.svg";
import cheeksSvg from "../assets/avatars/face/cheeks.svg?raw";
import mouthSvg from "../assets/avatars/face/mouth.svg?raw";
import noseSvg from "../assets/avatars/face/nose.svg?raw";

import beanieHairSvg from "../assets/avatars/hair/hair_beanie.svg?raw";
import shortHairBackSvg from "../assets/avatars/hair/shorthair_back.svg?raw";
import shortHairFrontSvg from "../assets/avatars/hair/shorthair_front.svg?raw";
import mediumHairBackSvg from "../assets/avatars/hair/mediumlonghair_back.svg?raw";
import mediumHairFrontSvg from "../assets/avatars/hair/mediumlong_Bangs_front.svg?raw";
import mediumSoftBangsFrontSvg from "../assets/avatars/hair/mediumlonghair_Softbangs_front.svg?raw";
import longHairBackSvg from "../assets/avatars/hair/longhair_back.svg?raw";
import longHairWavyFrontSvg from "../assets/avatars/hair/longhair_wavy_front.svg?raw";

type Hairstyle =
  | "beanie"
  | "short"
  | "medium-bangs"
  | "medium-soft-bangs"
  | "long-wavy";

const layerStyle = {
  position: "absolute" as const,
  inset: 0,
  width: "100%",
  height: "100%",
};

const scaleSvg = (svg: string) =>
  svg
    .replace(/width="[^"]*"/, 'width="100%"')
    .replace(/height="[^"]*"/, 'height="100%"');

export const skinColors = [
  "#433A30",
  "#624A2F",
  "#A2755B",
  "#DCAA74",
  "#FFDBB4",
  "#F4E4D2",
];

export const eyeColors = [
  "#3c1706",
  "#70550d",
  "#364514",
  "#356B45",
  "#5ac37a",
  "#4d91c9",
  "#194284",
];

export const eyebrowColors = [
  "#333333",
  "#31281d",
  "#6f4a1c",
  "#875624",
  "#b16722",
  "#D6A15C",
  "#faebab",
  "#fffb7a",
];

export const hairColors = [
  "#dadada",
  "#6d6c6a",
  "#333333",
  "#2B1B14",
  "#523c24",
  "#844b12",
  "#D6A15C",
  "#e6dfa8",
  "#ece118",
  "#f2b02b",
  "#d01515",
  "#eb5fe2",
  "#912bd6",
  "#422bd6",
  "#609cf0",
  "#2bcdd6",
  "#2bd67e",
  "#2bd631",
  "#2d960a",
];

interface AvatarComponentProps {
  hairstyle?: Hairstyle;
  skinColor?: string;
  eyeColor?: string;
  eyebrowColor?: string;
  hairColor?: string;
}

const AvatarComponent = ({
  hairstyle = "short",
  skinColor = "",
  eyeColor = "",
  eyebrowColor = "",
  hairColor = "",
}: AvatarComponentProps) => {
  const hairBackSvg =
    hairstyle === "short"
      ? shortHairBackSvg
      : hairstyle === "long-wavy"
        ? longHairBackSvg
        : mediumHairBackSvg;

  const hairFrontSvg =
    hairstyle === "beanie"
      ? beanieHairSvg
      : hairstyle === "short"
        ? shortHairFrontSvg
        : hairstyle === "medium-bangs"
          ? mediumHairFrontSvg
          : hairstyle === "medium-soft-bangs"
            ? mediumSoftBangsFrontSvg
            : longHairWavyFrontSvg;

  // lägg till för slingor
  const coloredHairBack = hairBackSvg.replace(/#CEA171/g, hairColor);
  const coloredHairFront = hairFrontSvg.replace(/#CEA171/g, hairColor);

  const coloredEyes = eyesSvg.replace(/#DB2AEB/g, eyeColor);

  const coloredEyebrows = eyebrowsSvg.replace(/#544D4D/g, eyebrowColor);

  const coloredBasebody = basebodySvg.replace(/#65C9FF/g, skinColor);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        maxHeight: "100%",
        aspectRatio: "224 / 376",
        overflow: "hidden",
      }}
    >
      <div
        style={layerStyle}
        dangerouslySetInnerHTML={{ __html: scaleSvg(coloredHairBack) }}
      />

      <div
        style={layerStyle}
        dangerouslySetInnerHTML={{ __html: scaleSvg(coloredBasebody) }}
      />

      {/* man ska kunna välja färg på kind och om man vill ha fräknar */}
      <div style={layerStyle} dangerouslySetInnerHTML={{ __html: scaleSvg(cheeksSvg) }} />

      <img src={freckles} alt="" style={layerStyle} />

      <div style={layerStyle} dangerouslySetInnerHTML={{ __html: scaleSvg(noseSvg) }} />

      <div
        style={layerStyle}
        dangerouslySetInnerHTML={{ __html: scaleSvg(coloredEyes) }}
      />

      <div
        style={layerStyle}
        dangerouslySetInnerHTML={{ __html: scaleSvg(coloredEyebrows) }}
      />

      <div style={layerStyle} dangerouslySetInnerHTML={{ __html: scaleSvg(mouthSvg) }} />

      <div
        style={layerStyle}
        dangerouslySetInnerHTML={{ __html: scaleSvg(coloredHairFront) }}
      />
    </div>
  );
};

export default AvatarComponent;
