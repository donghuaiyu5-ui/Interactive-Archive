import { yarnImage } from "../utils/yarnStorage.js";

export default function RoomYarn({
  yarn,
  dragging,
  onDragStart,
  onDrag,
  onDragEnd,
  onDragCancel,
  onSelect,
  onMoveWithKeyboard,
}) {
  return (
    <button
      className={`room-yarn ${dragging ? "dragging" : ""}`}
      style={{
        left: `${yarn.x}%`,
        top: `${yarn.y}%`,
        width: `${yarn.size}%`,
        "--angle": `${yarn.angle}deg`,
      }}
      aria-label={`View ${yarn.name}. Drag or use arrow keys to move.`}
      aria-describedby="room-help"
      onPointerDown={(event) => onDragStart(event, yarn)}
      onPointerMove={onDrag}
      onPointerUp={onDragEnd}
      onPointerCancel={onDragCancel}
      onClick={(event) => {
        if (event.currentTarget.dataset.dragged === "true") {
          delete event.currentTarget.dataset.dragged;
          return;
        }
        onSelect(yarn.id);
      }}
      onKeyDown={(event) => onMoveWithKeyboard(event, yarn)}
    >
      <img src={yarnImage(yarn)} alt="" draggable="false" />
      <span className="yarn-tooltip">{yarn.name}</span>
    </button>
  );
}
