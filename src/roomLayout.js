import yarnData from "./yarns.json";

// Coordinates use percentages, so yarns stay attached to the same room locations
// when the entire scene scales. Each photo remains one archive entry.
const placements = [
  [17, 56, 9, -12],
  [53, 18, 5, 5],
  [30, 64, 11, -17],
  [86, 59, 11, 12],
  [41, 75, 10, -8],
  [59, 62, 10, 9],
  [12, 87, 12, -9],
  [64, 18, 5, -6],
  [77, 83, 12, 7],
  [87, 18, 5, 12],
  [53, 89, 10, -9],
  [25, 88, 10, 5],
  [89, 93, 11, -8],
  [72, 52, 10, 14],
  [8, 67, 7, -8],
];
export const initialYarns = yarnData.map((yarn, index) => {
  const [x, y, size, angle] = placements[index];
  return { ...yarn, x, y, size, angle };
});
