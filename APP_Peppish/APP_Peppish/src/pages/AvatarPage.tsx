import { useEffect, useState } from "react";
import Avatar, {
  skinColors,
  eyeColors,
  eyebrowColors,
  hairColors,
} from "../components/AvatarComponent";

import { useAuth } from "../context/AuthContext";
import { userServiceApi } from "../services/userService.api";

import "../styling/avatar.css";

type Hairstyle =
  | "beanie"
  | "short"
  | "medium-bangs"
  | "medium-soft-bangs"
  | "long-wavy";

interface ColorDropdownProps {
  label: string;
  value: string;
  colors: string[];
  onChange: (color: string) => void;
}

interface ColorDropdownProps {
  label: string;
  value: string;
  colors: string[];
  onChange: (color: string) => void;
}

interface ColorDropdownProps {
  label: string;
  value: string;
  colors: string[];
  onChange: (color: string) => void;
}

const ColorDropdown = ({
  label,
  value,
  colors,
  onChange,
}: ColorDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="avatar-option color-option">
      <label>{label}</label>

      <div className="color-dropdown">
        <button
          type="button"
          className="color-dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={`Välj ${label.toLowerCase()}`}
        >
          <span
            className="color-swatch-preview"
            style={{ backgroundColor: value || "#eeeeee" }}
          />
        </button>

        {isOpen && (
          <div className="color-dropdown-menu">
            {colors.map((color, index) => (
              <button
                key={color}
                type="button"
                className={`color-swatch ${value === color ? "selected" : ""}`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
                aria-label={`Färg ${index + 1}`}
                aria-pressed={value === color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const AvatarPage = () => {
  const { user, updateUser } = useAuth();

  const [hairstyle, setHairstyle] = useState<Hairstyle>("beanie");
  const [skinColor, setSkinColor] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [eyebrowColor, setEyebrowColor] = useState("");
  const [hairColor, setHairColor] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;

    setHairstyle(user.hairstyle as Hairstyle);
    setSkinColor(user.skinColor);
    setEyeColor(user.eyeColor);
    setEyebrowColor(user.eyebrowColor);
    setHairColor(user.hairColor);
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setMessage("");

    try {
      const updatedUser = await userServiceApi.updateAvatar({
        hairstyle,
        skinColor,
        eyeColor,
        eyebrowColor,
        hairColor,
      });

      updateUser(updatedUser);
      setMessage("Din avatar har sparats!");
    } catch {
      setMessage("Det gick inte att spara din avatar. Försök igen.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="avatar-page">
      <h2>Ändra din avatars utseende:</h2>

      <div className="avatar-editor">
        <div className="avatar-preview">
          <Avatar
            hairstyle={hairstyle}
            skinColor={skinColor}
            eyeColor={eyeColor}
            eyebrowColor={eyebrowColor}
            hairColor={hairColor}
          />
        </div>

        <div className="avatar-options">
          <ColorDropdown
            label="Hudfärg"
            value={skinColor}
            colors={skinColors}
            onChange={setSkinColor}
          />

          <ColorDropdown
            label="Ögonfärg"
            value={eyeColor}
            colors={eyeColors}
            onChange={setEyeColor}
          />

          <ColorDropdown
            label="Ögonbrynsfärg"
            value={eyebrowColor}
            colors={eyebrowColors}
            onChange={setEyebrowColor}
          />

          <ColorDropdown
            label="Hårfärg"
            value={hairColor}
            colors={hairColors}
            onChange={setHairColor}
          />

          <div className="avatar-column">
            <div className="avatar-option">
              <div className="avatar-hairstyle-option">
                <label htmlFor="hairstyle">Frisyr</label>

                <select
                  id="hairstyle"
                  value={hairstyle}
                  onChange={(e) => setHairstyle(e.target.value as Hairstyle)}
                >
                  <option value="beanie">Mössa & mellanlångt hår</option>
                  <option value="short">Kort hår</option>
                  <option value="medium-bangs">Mellanlångt hår med lugg</option>
                  <option value="medium-soft-bangs">
                    Mellanlångt hår med mjuk lugg
                  </option>
                  <option value="long-wavy">Långt vågigt hår</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !user}
              >
                {isSaving ? "Sparar..." : "Spara avatar"}
              </button>

              {message && <p>{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvatarPage;
