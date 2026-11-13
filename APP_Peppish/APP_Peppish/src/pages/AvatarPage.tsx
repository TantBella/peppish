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

type Hairstyle = "short" | "medium-bangs" | "medium-soft-bangs";

export const AvatarPage = () => {
  const { user, updateUser } = useAuth();

  const [hairstyle, setHairstyle] = useState<Hairstyle>("short");
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
      <h2>Ändra avatarens utseende:</h2>

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
          <div className="avatar-option">
            <label htmlFor="hairstyle">Frisyr</label>
            <select
              id="hairstyle"
              value={hairstyle}
              onChange={(e) => setHairstyle(e.target.value as Hairstyle)}
            >
              <option value="short">Kort hår</option>
              <option value="medium-bangs">Mellanlångt hår med lugg</option>
              <option value="medium-soft-bangs">
                Mellanlångt hår med mjuk lugg
              </option>
            </select>
          </div>

          <div className="avatar-option">
            <label>Hudfärg</label>
            <div className="color-options">
              {skinColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-button ${skinColor === color ? "selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSkinColor(color)}
                  aria-label={`Välj hudfärg ${color}`}
                  aria-pressed={skinColor === color}
                />
              ))}
            </div>
          </div>

          <div className="avatar-option">
            <label>Ögonfärg</label>
            <div className="color-options">
              {eyeColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-button ${eyeColor === color ? "selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setEyeColor(color)}
                  aria-label={`Välj ögonfärg ${color}`}
                  aria-pressed={eyeColor === color}
                />
              ))}
            </div>
          </div>

          <div className="avatar-option">
            <label>Ögonbrynsfärg</label>
            <div className="color-options">
              {eyebrowColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-button ${eyebrowColor === color ? "selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setEyebrowColor(color)}
                  aria-label={`Välj ögonbrynsfärg ${color}`}
                  aria-pressed={eyebrowColor === color}
                />
              ))}
            </div>
          </div>

          <div className="avatar-option">
            <label>Hårfärg</label>
            <div className="color-options">
              {hairColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-button ${hairColor === color ? "selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setHairColor(color)}
                  aria-label={`Välj hårfärg ${color}`}
                  aria-pressed={hairColor === color}
                />
              ))}
            </div>
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
    </section>
  );
};

export default AvatarPage;
