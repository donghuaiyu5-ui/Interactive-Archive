const database = new Promise((resolve, reject) => {
  const request = indexedDB.open("my-yarn-room", 1);
  request.onupgradeneeded = () => request.result.createObjectStore("room");
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

export async function readRoom() {
  const db = await database;
  return new Promise((resolve, reject) => {
    const request = db.transaction("room").objectStore("room").get("yarns");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveRoom(yarns) {
  const db = await database;
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("room", "readwrite");
    transaction.objectStore("room").put(yarns, "yarns");
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

export const yarnImage = (yarn) =>
  yarn.imageData || `${import.meta.env.BASE_URL}yarns/${yarn.image}`;
