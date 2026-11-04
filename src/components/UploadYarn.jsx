import { useEffect, useRef, useState } from "react";

export default function UploadYarn({ onAdd, onClose }) {
  const dialog = useRef(null);
  const [imageData, setImageData] = useState("");
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  const [name, setName] = useState("");
  const [colors, setColors] = useState("");
  const [notes, setNotes] = useState("");
  const readVersion = useRef(0);
  useEffect(() => {
    dialog.current.showModal();
  }, []);

  function chooseFile(event) {
    const version = ++readVersion.current;
    const file = event.target.files[0];
    setImageData("");
    setError("");
    setReading(false);
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp", "image/gif"].includes(
        file.type,
      )
    ) {
      setError("Choose a PNG, JPG, WebP, or GIF image.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Choose an image smaller than 10 MB.");
      return;
    }
    setReading(true);
    const reader = new FileReader();
    reader.onerror = () => {
      if (version === readVersion.current) {
        setReading(false);
        setError("Could not read this file. Please try another image.");
      }
    };
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => {
        if (version === readVersion.current) {
          setReading(false);
          setError("This image could not be opened. Try another file.");
        }
      };
      image.onload = () => {
        if (version === readVersion.current) {
          setImageData(reader.result);
          setReading(false);
        }
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function submit(event) {
    event.preventDefault();
    if (!imageData || !name.trim() || !colors.trim()) {
      setError("Add a photo, a name, and at least one color.");
      return;
    }
    const colorList = [
      ...new Set(
        colors
          .split(/[,，]/)
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    ];
    if (!colorList.length) {
      setError("Enter at least one color.");
      return;
    }
    onAdd({
      name: name.trim(),
      colors: colorList.map(
        (value) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
      ),
      description: notes.trim() || "A new yarn in my collection.",
      kind: "Uploaded yarn",
      imageData,
    });
  }

  return (
    <dialog
      ref={dialog}
      className="details-window upload-window"
      aria-labelledby="upload-title"
      onClose={onClose}
    >
      <div className="window-bar">
        <span id="upload-title">Add a yarn to your room</span>
        <button
          type="button"
          aria-label="Close upload"
          onClick={() => dialog.current.close()}
        >
          ×
        </button>
      </div>
      <form className="upload-form" onSubmit={submit}>
        <p>A new color, a little memory. Give your yarn a home.</p>
        <label>
          Yarn photo
          <input
            autoFocus
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={chooseFile}
            required
          />
          <small>
            PNG, JPG, WebP, or GIF · up to 10 MB. Transparent PNGs blend into
            the room.
          </small>
        </label>
        {imageData && (
          <img
            className="upload-preview"
            src={imageData}
            alt="Selected yarn preview"
          />
        )}
        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            placeholder="e.g. Sunday morning"
            required
          />
        </label>
        <label>
          Colors
          <input
            value={colors}
            onChange={(event) => setColors(event.target.value)}
            maxLength={150}
            placeholder="e.g. Green, Pink"
            required
          />
          <small>Separate colors with commas.</small>
        </label>
        <label>
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="What makes this yarn special? What would you make with it?"
          />
        </label>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <p className="storage-note">
          Saved only in this browser. Your photo stays on this device.
        </p>
        <div className="form-actions">
          <button
            type="button"
            className="retro-button"
            onClick={() => dialog.current.close()}
          >
            Cancel
          </button>
          <button className="retro-button" disabled={reading || !imageData}>
            {reading ? "Reading photo…" : "Add to room"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
