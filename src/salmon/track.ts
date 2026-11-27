// Geometry for the stadium-shaped track the red arrow travels along.
// Everything is in the board's SVG coordinate space.

export const STAGE_COUNT = 6;

export const TRACK = {
  left: 250,
  right: 1150,
  top: 455,
  bottom: 545,
};

const radius = (TRACK.bottom - TRACK.top) / 2;
const centerY = (TRACK.top + TRACK.bottom) / 2;
const straight = TRACK.right - TRACK.left;
const arc = Math.PI * radius;

export const TRACK_LENGTH = 2 * straight + 2 * arc;

// x centers of the three columns of circles.
export const COLUMN_X = [330, 700, 1070];

// Arc-length position of each stage on the track. The arrow travels clockwise:
// left to right along the top row, then right to left along the bottom row.
export const STAGE_ANCHORS = [
  COLUMN_X[0] - TRACK.left,
  COLUMN_X[1] - TRACK.left,
  COLUMN_X[2] - TRACK.left,
  straight + arc + (TRACK.right - COLUMN_X[2]),
  straight + arc + (TRACK.right - COLUMN_X[1]),
  straight + arc + (TRACK.right - COLUMN_X[0]),
];

export interface TrackPoint {
  x: number;
  y: number;
  /** Direction pointing away from the track, in degrees. */
  angle: number;
}

const mod = (n: number, m: number): number => ((n % m) + m) % m;

export const pointAtDistance = (distance: number): TrackPoint => {
  let s = mod(distance, TRACK_LENGTH);

  if (s < straight) {
    return { x: TRACK.left + s, y: TRACK.top, angle: -90 };
  }
  s -= straight;

  if (s < arc) {
    const phi = -Math.PI / 2 + s / radius;
    return {
      x: TRACK.right + radius * Math.cos(phi),
      y: centerY + radius * Math.sin(phi),
      angle: (phi * 180) / Math.PI,
    };
  }
  s -= arc;

  if (s < straight) {
    return { x: TRACK.right - s, y: TRACK.bottom, angle: 90 };
  }
  s -= straight;

  const phi = Math.PI / 2 + s / radius;
  return {
    x: TRACK.left + radius * Math.cos(phi),
    y: centerY + radius * Math.sin(phi),
    angle: (phi * 180) / Math.PI,
  };
};

/**
 * Converts a progress value (in stages, so 0 = first stage, 1 = second stage, 6 = back to
 * the first stage) into an arc-length distance on the track.
 */
export const distanceAtProgress = (progress: number): number => {
  const base = Math.floor(progress);
  const fraction = progress - base;
  const index = mod(base, STAGE_COUNT);
  const from = STAGE_ANCHORS[index];
  const to = index === STAGE_COUNT - 1 ? STAGE_ANCHORS[0] + TRACK_LENGTH : STAGE_ANCHORS[index + 1];
  return mod(from + (to - from) * fraction, TRACK_LENGTH);
};

export const pointAtProgress = (progress: number): TrackPoint =>
  pointAtDistance(distanceAtProgress(progress));

/** A stage lights up slightly before the arrow reaches it and stays lit until the next one. */
export const ACTIVATION_LEAD = 0.1;

export const activeStageAt = (progress: number): number =>
  mod(Math.floor(progress + ACTIVATION_LEAD), STAGE_COUNT);

export const TRACK_PATH = [
  `M ${TRACK.left} ${TRACK.top}`,
  `L ${TRACK.right} ${TRACK.top}`,
  `A ${radius} ${radius} 0 0 1 ${TRACK.right} ${TRACK.bottom}`,
  `L ${TRACK.left} ${TRACK.bottom}`,
  `A ${radius} ${radius} 0 0 1 ${TRACK.left} ${TRACK.top}`,
  'Z',
].join(' ');
