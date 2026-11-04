export default function RoomToolbar({
  query,
  onQueryChange,
  color,
  onColorChange,
  colors,
  visibleCount,
  totalCount,
  ready,
  onUpload,
  onReset,
}) {
  return (
    <div className="controls-bar">
      <div className="toolbar">
        <label className="yarn-search">
          Search
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Name, color, or notes…"
          />
        </label>
        <label>
          Find a color{" "}
          <select
            value={color}
            onChange={(event) => onColorChange(event.target.value)}
          >
            {colors.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <span className="yarn-count" aria-live="polite">
          {visibleCount} / {totalCount} yarns
        </span>
        <button className="retro-button" disabled={!ready} onClick={onUpload}>
          + Add yarn
        </button>
        <button className="retro-button" disabled={!ready} onClick={onReset}>
          Reset room
        </button>
      </div>
    </div>
  );
}
