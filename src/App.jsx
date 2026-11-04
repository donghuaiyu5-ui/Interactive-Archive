import { useEffect, useRef, useState } from "react";
import { initialYarns } from "./roomLayout.js";
import RoomToolbar from "./components/RoomToolbar.jsx";
import RoomYarn from "./components/RoomYarn.jsx";
import YarnDetails from "./components/YarnDetails.jsx";
import UploadYarn from "./components/UploadYarn.jsx";
import { readRoom, saveRoom } from "./utils/yarnStorage.js";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function App() {
  const [yarns, setYarns] = useState(initialYarns);
  const [query, setQuery] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [color, setColor] = useState("All colors");
  const [draggingId, setDraggingId] = useState(null);
  const [message, setMessage] = useState(
    "Welcome home. There are 15 yarns to explore.",
  );
  const roomRef = useRef(null);
  const gesture = useRef(null);
  const colors = [
    "All colors",
    ...new Set(yarns.flatMap((yarn) => yarn.colors)),
  ];
  const selected = yarns.find((yarn) => yarn.id === selectedId);
  const visibleYarns = yarns.filter(
    (yarn) =>
      (color === "All colors" || yarn.colors.includes(color)) &&
      `${yarn.name} ${yarn.colors.join(" ")} ${yarn.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );

  useEffect(() => {
    readRoom()
      .then((saved) => {
        if (Array.isArray(saved) && saved.length) setYarns(saved);
      })
      .catch(() =>
        setStorageError(
          "Browser storage is unavailable. Changes will last until this page is closed.",
        ),
      )
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    // Save after a short pause rather than writing on every pointer movement.
    const timer = setTimeout(() => {
      saveRoom(yarns)
        .then(() => setStorageError(""))
        .catch(() =>
          setStorageError(
            "Your latest changes could not be saved. Keep this page open or free up browser storage.",
          ),
        );
    }, 300);
    return () => clearTimeout(timer);
  }, [yarns, ready]);

  function addYarn(details) {
    const id = Math.max(0, ...yarns.map((yarn) => yarn.id)) + 1;
    setYarns((previous) => [
      ...previous,
      {
        ...details,
        id,
        x: 35 + Math.random() * 30,
        y: 55 + Math.random() * 30,
        size: 10,
        angle: 0,
      },
    ]);
    setQuery("");
    setColor("All colors");
    setUploadOpen(false);
    setMessage(`${details.name} added to your room.`);
  }

  function resetRoom() {
    setYarns((previous) =>
      previous.map((yarn, index) => {
        const original = initialYarns.find((item) => item.id === yarn.id);
        return (
          original || {
            ...yarn,
            x: 25 + (index % 6) * 10,
            y: 65 + (index % 3) * 10,
          }
        );
      }),
    );
    setColor("All colors");
    setQuery("");
    setMessage("Room arrangement reset. Your uploaded yarns are kept.");
  }

  function startDrag(event, yarn) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = {
      id: yarn.id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: yarn.x,
      y: yarn.y,
      moved: false,
    };
  }

  function drag(event) {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (!current.moved && Math.hypot(dx, dy) < 5) return;
    current.moved = true;
    setDraggingId(current.id);
    const bounds = roomRef.current.getBoundingClientRect();
    setYarns((previous) =>
      previous.map((yarn) =>
        yarn.id === current.id
          ? {
              ...yarn,
              x: clamp(
                current.x + (dx / bounds.width) * 100,
                yarn.size / 2,
                100 - yarn.size / 2,
              ),
              y: clamp(
                current.y + (dy / bounds.height) * 100,
                (yarn.size * 2) / 3,
                100 - (yarn.size * 2) / 3,
              ),
            }
          : yarn,
      ),
    );
  }

  function finishDrag(event) {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (current.moved) setMessage("Yarn moved. Make yourself at home.");
    gesture.current = null;
    setDraggingId(null);
    // A pointer click after dragging must not open the details window.
    if (current.moved) event.currentTarget.dataset.dragged = "true";
  }

  function moveWithKeyboard(event, yarn) {
    const directions = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    if (!directions[event.key]) return;
    event.preventDefault();
    const [dx, dy] = directions[event.key];
    const step = event.shiftKey ? 4 : 1;
    setYarns((previous) =>
      previous.map((item) =>
        item.id === yarn.id
          ? {
              ...item,
              x: clamp(item.x + dx * step, item.size / 2, 100 - item.size / 2),
              y: clamp(
                item.y + dy * step,
                (item.size * 2) / 3,
                100 - (item.size * 2) / 3,
              ),
            }
          : item,
      ),
    );
    setMessage(`${yarn.name} moved.`);
  }

  return (
    <main className="desktop">
      <section className="game-window" aria-label="My Yarn Room">
        <header className="top-bar">
          <h1>
            <span aria-hidden="true">✿</span> My Yarn Room
          </h1>
          <p className="top-bar-note">
            Welcome home. There are {yarns.length} yarns to explore.
          </p>
        </header>
        <RoomToolbar
          query={query}
          onQueryChange={setQuery}
          color={color}
          onColorChange={setColor}
          colors={colors}
          visibleCount={visibleYarns.length}
          totalCount={yarns.length}
          ready={ready}
          onUpload={() => setUploadOpen(true)}
          onReset={resetRoom}
        />
        {storageError && (
          <p className="storage-error" role="alert">
            {storageError}
          </p>
        )}
        <div className="room-scroll">
          <div className="room" ref={roomRef}>
            <img
              className="room-background"
              src={`${import.meta.env.BASE_URL}bk.jpg`}
              alt="A cozy room with a garden window, wooden display cabinet, and oval green rug"
              draggable="false"
            />
            {!visibleYarns.length && (
              <div className="no-matches">
                <p>No yarns found. Try another name or color.</p>
                <button
                  className="retro-button"
                  onClick={() => {
                    setQuery("");
                    setColor("All colors");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
            {visibleYarns.map((yarn) => (
              <RoomYarn
                key={yarn.id}
                yarn={yarn}
                dragging={draggingId === yarn.id}
                onDragStart={startDrag}
                onDrag={drag}
                onDragEnd={finishDrag}
                onDragCancel={() => {
                  gesture.current = null;
                  setDraggingId(null);
                }}
                onSelect={setSelectedId}
                onMoveWithKeyboard={moveWithKeyboard}
              />
            ))}
          </div>
        </div>
        <p id="room-help" className="sr-only">
          Click to look closer. Drag to rearrange. Use arrow keys to move.
        </p>
      </section>
      <p className="sr-only" role="status">
        {message}
      </p>
      {uploadOpen && (
        <UploadYarn onAdd={addYarn} onClose={() => setUploadOpen(false)} />
      )}
      {selected && (
        <YarnDetails
          key={selected.id}
          yarn={selected}
          onClose={() => setSelectedId(null)}
          onRemove={(id) => {
            setYarns((previous) => previous.filter((yarn) => yarn.id !== id));
            setSelectedId(null);
            setColor("All colors");
            setMessage("Uploaded yarn removed.");
          }}
        />
      )}
    </main>
  );
}
