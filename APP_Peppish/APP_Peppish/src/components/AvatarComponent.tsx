import basebodySvg from "../assets/avatars/base/basebody.svg?raw";

import cheeks from "../assets/avatars/face/cheeks.svg";
import eyebrowsSvg from "../assets/avatars/face/eyebrows.svg?raw";
import eyesSvg from "../assets/avatars/face/eyes.svg?raw";
import freckles from "../assets/avatars/face/freckles.svg";
import mouth from "../assets/avatars/face/mouth.svg";
import nose from "../assets/avatars/face/nose.svg";

import shortHairBackSvg from "../assets/avatars/hair/shorthair_back.svg?raw";
import shortHairFrontSvg from "../assets/avatars/hair/shorthair_front.svg?raw";
import mediumHairBackSvg from "../assets/avatars/hair/mediumlonghair_back.svg?raw";
import mediumHairFrontSvg from "../assets/avatars/hair/mediumlong_Bangs_front.svg?raw";
import mediumSoftBangsFrontSvg from "../assets/avatars/hair/mediumlonghair_Softbangs_front.svg?raw";

type Hairstyle = "short" | "medium-bangs" | "medium-soft-bangs";

const layerStyle = {
  position: "absolute" as const,
  inset: 0,
  width: "100%",
  height: "100%",
};

export const skinColors = [
  "#433A30",
  "#624A2F",
  "#A2755B",
  "#CEA171",
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
  "#433A30",
  "#624A2F",
  "#A2755B",
  "#b16722",
  "#D6A15C",
  "#f0dbbe",
  "#fffb7a",
];

export const hairColors = [
  "#333333",
  "#2B1B14",
  "#624A2F",
  "#A2755B",
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
  // skinColor = "#65C9FF",
  // eyeColor = "#5B3828",
  // eyebrowColor = "#433A30",
  // hairColor = "#624A2F",
}: AvatarComponentProps) => {
  const hairBackSvg =
    hairstyle === "short" ? shortHairBackSvg : mediumHairBackSvg;

  const hairFrontSvg =
    hairstyle === "short"
      ? shortHairFrontSvg
      : hairstyle === "medium-bangs"
        ? mediumHairFrontSvg
        : mediumSoftBangsFrontSvg;

  const coloredHairBack = hairBackSvg.replace(/#FB2D2D/g, hairColor);
  const coloredHairFront = hairFrontSvg.replace(/#FB2D2D/g, hairColor);

  const coloredEyes = eyesSvg.replace(/#DB2AEB/g, eyeColor);

  const coloredEyebrows = eyebrowsSvg.replace(/#B12222/g, eyebrowColor);

  const coloredBasebody = basebodySvg.replace(/#65C9FF/g, skinColor);

  return (
    <div
      style={{
        position: "relative",
        width: "224px",
        aspectRatio: "224 / 376",
      }}
    >
      <div
        style={layerStyle}
        dangerouslySetInnerHTML={{ __html: coloredHairBack }}
      />

      <div
        style={layerStyle}
        dangerouslySetInnerHTML={{ __html: coloredBasebody }}
      />

      {/* man ska kunna välja färg på kind och om man vill ha fräknar */}
      <img src={cheeks} alt="" style={layerStyle} />
      <img src={freckles} alt="" style={layerStyle} />
      <img src={nose} alt="" style={layerStyle} />

      <div
        style={layerStyle}
        dangerouslySetInnerHTML={{ __html: coloredEyes }}
      />

      <div
        style={layerStyle}
        dangerouslySetInnerHTML={{ __html: coloredEyebrows }}
      />

      <img src={mouth} alt="" style={layerStyle} />

      <div
        style={layerStyle}
        dangerouslySetInnerHTML={{ __html: coloredHairFront }}
      />
    </div>
  );
};

export default AvatarComponent;
