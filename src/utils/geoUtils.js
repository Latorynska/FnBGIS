export function calculatePolygonArea(coords) {
  const R = 6378137;
  let area = 0;

  const toRad = (deg) => deg * Math.PI / 180;

  if (!Array.isArray(coords) || coords.length < 3) return 0;

  for (let i = 0; i < coords.length; i++) {
    const [lat1, lon1] = coords[i];
    const [lat2, lon2] = coords[(i + 1) % coords.length];

    area += toRad(lon2 - lon1) *
            (2 + Math.sin(toRad(lat1)) + Math.sin(toRad(lat2)));
  }

  area = area * R * R / 2;
  return Math.abs(area);
}
