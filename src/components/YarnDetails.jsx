import { useEffect, useRef } from "react";
import { yarnImage } from "../utils/yarnStorage.js";

export default function YarnDetails({ yarn, onClose, onRemove }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="details-window"
      aria-labelledby="details-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
    >
      <div className="window-bar">
        <span>Yarn archive / No. {String(yarn.id).padStart(2, "0")}</span>
        <button
          autoFocus
          onClick={() => dialogRef.current.close()}
          aria-label="Close yarn details"
        >
          ×
        </button>
      </div>
      <div className="details-content">
        <div className="details-image">
          <img src={yarnImage(yarn)} alt={yarn.description} />
        </div>
        <div className="details-text">
          <span className="small-label">FROM MY YARN ROOM</span>
          <h2 id="details-title">{yarn.name}</h2>
          <p>{yarn.description}</p>
          <dl>
            <dt>Colors</dt>
            <dd>{yarn.colors.join(" / ")}</dd>
            <dt>Collection</dt>
            <dd>{yarn.kind}</dd>
          </dl>
          {!yarn.imageData && (
            <p className="working-note">
              A working name, inspired by its colors.
            </p>
          )}
          {yarn.imageData && (
            <button
              className="retro-button remove-yarn"
              onClick={() => onRemove(yarn.id)}
            >
              Remove this yarn
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
