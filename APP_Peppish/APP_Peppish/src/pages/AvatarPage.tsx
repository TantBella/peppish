import { useState } from "react";
import Avatar, {
  skinColors,
  eyeColors,
  eyebrowColors,
  hairColors,
} from "../components/AvatarComponent";

import "../styling/avatar.css";

type Hairstyle = "short" | "medium-bangs" | "medium-soft-bangs";

export const AvatarPage = () => {
  const [hairstyle, setHairstyle] = useState<Hairstyle>("short");
  const [skinColor, setSkinColor] = useState("#5e3ab4");
  const [eyeColor, setEyeColor] = useState("#ba2d5c");
  const [eyebrowColor, setEyebrowColor] = useState("#e8f800");
  const [hairColor, setHairColor] = useState("#bd28b1");

  return (
    <section className="avatar-page">
      <h1>Skapa din avatar</h1>
      <p>Välj hur din avatar ska se ut!</p>

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
        </div>
      </div>
    </section>
  );
};

export default AvatarPage;
